import { Shopify } from "@shopify/shopify-api";
import topLevelAuthRedirect from "../helpers/top-level-auth-redirect.js";
import insertData from "../Dao/insert.js";
import insertSyncedOrders from "../Dao/insertSyncedOrders.js";
import getOrders from "../helpers/getOrders.js";
import createWebhook from "../webhooks/createWebhook.js";
// import updateOrdersWebhook from "../webhooks/updateOrdersWehook.js";
var sess;
export default function applyAuthMiddleware(app) {
  app.get("/auth", async (req, res) => {
    if (!req.signedCookies[app.get("top-level-oauth-cookie")]) {
      return res.redirect(`/auth/toplevel?shop=${req.query.shop}`);
    }

    const redirectUrl = await Shopify.Auth.beginAuth(
      req,
      res,
      req.query.shop,
      "/auth/callback",
      app.get("use-online-tokens")
    );

    res.redirect(redirectUrl);
  });

  app.get("/auth/toplevel", (req, res) => {
    res.cookie(app.get("top-level-oauth-cookie"), "1", {
      signed: true,
      httpOnly: true,
      sameSite: "strict",
    });

    res.set("Content-Type", "text/html");

    res.send(
      topLevelAuthRedirect({
        apiKey: Shopify.Context.API_KEY,
        hostName: Shopify.Context.HOST_NAME,
        shop: req.query.shop,
      })
    );
  });

  app.get("/auth/callback", async (req, res) => {
    try {
      const session = await Shopify.Auth.validateAuthCallback(
        req,
        res,
        req.query
      );
      //  sess = req.session;
      // console.log( req.session.id , '-------------' );
      sess = req.session;
      sess.myshop = session.shop;

      console.log(sess, "our shop 62");
      app.set(
        "active-shopify-shops",
        Object.assign(app.get("active-shopify-shops"), {
          [session.shop]: session.scope,
        })
      );

      const response = await Shopify.Webhooks.Registry.register({
        shop: session.shop,
        accessToken: session.accessToken,
        topic: "APP_UNINSTALLED",
        path: "/webhooks",
      });
      //  console.log(response["APP_UNINSTALLED"].success);
      if (!response["APP_UNINSTALLED"].success) {
        console.log(
          `Failed to register APP_UNINSTALLED webhook: ${response.result}`
        );
      }

      // STEP-1 inserting shops info on app installation
      const host = req.query.host;
      process.env.TEMP_STORE = session.shop;
      console.log(session.shop +' in auth 85');
      console.log(session.accessToken + 'our access token');
      try {
        insertData(session, host, process.env.SHOPIFY_API_KEY);
        // Sync orders on installation and insert
        const orderData = await getOrders(session);
        const obj = JSON.parse(orderData);
      
        obj.orders.forEach((element) => {
          console.log(element + 'we got in auth 87!!!');
          insertSyncedOrders(element, session.shop);
        });
      } catch (error) {
        console.log(error);
      }

      // console.dir( session );
      //webhook part

      //STEP-2
      //@param
      // @session, @checkoutTopic, @checkoutUrl
      createWebhook(session, "orders/fulfilled", "ordersWebhook")
        .then((data) => {
          // res.status(200).send();
          console.log("webhook for ORDER FULLFILMENT created " + data);
        })
        .catch((e) => {
          console.log(e.message);
        });

      createWebhook(session, "checkouts/create", "checkoutWebhook")
        .then((data) => {
          console.log("webhook for CHECKOUT ORDERS created" + data);
        })
        .catch((e) => {
          console.log(e.message);
        });

      createWebhook(session, "app/uninstalled", "appUninstalledWebhook")
        .then((data) => {
          console.log("webhook for APP UNINSTALLED created" + data);
        })
        .catch((e) => {
          console.log(e.message);
        });

      //webhook end
      res.redirect(`/?shop=${session.shop}&host=${host}`);
    } catch (e) {
      switch (true) {
        case e instanceof Shopify.Errors.InvalidOAuthError:
          res.status(400);
          res.send(e.message);
          break;
        case e instanceof Shopify.Errors.CookieNotFound:
        case e instanceof Shopify.Errors.SessionNotFound:
          // This is likely because the OAuth session cookie expired before the merchant approved the request
          res.redirect(`/auth?shop=${req.query.shop}`);
          break;
        default:
          res.status(500);
          res.send(e.message);
          break;
      }
    }
  });
}
