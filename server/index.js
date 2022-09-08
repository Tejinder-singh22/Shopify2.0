// @ts-check
import mypath, { resolve } from "path";
// @ts-ignore
import express from "express";
import { fileURLToPath } from "url";
import dbConnection from "./Database/db.js";
import addShopValidation from "./validator/shopValidator.js";
import router from "./routes/router.js";
// @ts-ignore
import bodyParser from "body-parser";
// @ts-ignore
import cookieParser from "cookie-parser";
import { Shopify, ApiVersion } from "@shopify/shopify-api";
import "dotenv/config";
import errorMiddleware  from "./middleware/error.js";

import applyAuthMiddleware from "./middleware/auth.js";
import verifyRequest from "./middleware/verify-request.js";
// @ts-ignore
import session from "express-session";
// @ts-ignore
const __filename = fileURLToPath(import.meta.url);
const __dirname = mypath.dirname(__filename);
const USE_ONLINE_TOKENS = true;
const TOP_LEVEL_OAUTH_COOKIE = "shopify_top_level_oauth";

const PORT = parseInt(process.env.PORT || "8081", 10);
const isTest = process.env.NODE_ENV === "test" || !!process.env.VITE_TEST_BUILD;

Shopify.Context.initialize({
  // @ts-ignore
  API_KEY: process.env.SHOPIFY_API_KEY,
  // @ts-ignore
  API_SECRET_KEY: process.env.SHOPIFY_API_SECRET,
  // @ts-ignore
  SCOPES: process.env.SCOPES.split(","),
  // @ts-ignore
  HOST_NAME: process.env.HOST.replace(/https:\/\//, ""),
  API_VERSION: ApiVersion.April22,
  IS_EMBEDDED_APP: true,
  // This should be replaced with your preferred storage strategy
  SESSION_STORAGE: new Shopify.Session.MemorySessionStorage(),
});

// Storing the currently active shops in memory will force them to re-login when your server restarts. You should
// persist this object in your app.
const ACTIVE_SHOPIFY_SHOPS = {};
Shopify.Webhooks.Registry.addHandler("APP_UNINSTALLED", {
  path: "/webhooks",
  // @ts-ignore
  // @ts-ignore
  webhookHandler: async (topic, shop, body) => {
    delete ACTIVE_SHOPIFY_SHOPS[shop];
  },
});

// export for test use only
export async function createServer(
  root = process.cwd(),
  isProd = process.env.NODE_ENV === "production"
) {
  const app = express();
  // @ts-ignore
  app.set("top-level-oauth-cookie", TOP_LEVEL_OAUTH_COOKIE);
  // @ts-ignore
  app.set("active-shopify-shops", ACTIVE_SHOPIFY_SHOPS);
  // @ts-ignore
  app.set("use-online-tokens", USE_ONLINE_TOKENS);
  // @ts-ignore
  app.set("view engine", "ejs");
  // @ts-ignore
  app.use(cookieParser(Shopify.Context.API_SECRET_KEY));
  const TenYrs = 10 * 365 * 24 * 60 * 60;
  // @ts-ignore
  app.use(
    session({
      secret: "ssshhhhh",
      cookie: { maxAge: TenYrs },
      saveUninitialized: false,
      resave: true,
    })
  );
  // @ts-ignore
  app.use(bodyParser.json());
  // @ts-ignore
  app.use(bodyParser.urlencoded({ extended: true }));

  applyAuthMiddleware(app);

  dbConnection.on("error", console.error.bind(console, "connection error: "));
  dbConnection.once("open", function () {
    console.log("MongoDB Connection successfull");
  });

  // @ts-ignore
  app.post("/webhooks", async (req, res) => {
    try {
      await Shopify.Webhooks.Registry.process(req, res);
      console.log(`Webhook processed, returned status code 200`);
    } catch (error) {
      console.log(`Failed to process webhook: ${error}`);
      res.status(500).send(error.message);
    }
  });

  // @ts-ignore
  app.get("/products-count", verifyRequest(app), async (req, res) => {
    const session = await Shopify.Utils.loadCurrentSession(req, res, true);
    const { Product } = await import(
      `@shopify/shopify-api/dist/rest-resources/${Shopify.Context.API_VERSION}/index.js`
    );

    const countData = await Product.count({ session });
    res.status(200).send(countData);
  });

  // @ts-ignore
  app.post("/graphql", verifyRequest(app), async (req, res) => {
    try {
      const response = await Shopify.Utils.graphqlProxy(req, res);
      res.status(200).send(response.body);
    } catch (error) {
      res.status(500).send(error.message);
    }
  });

  // @ts-ignore
  app.use(express.json());

  // @ts-ignore
  // @ts-ignore
  app.get("/form", (req, res) => {
    res.render(__dirname + "/views/index");
  });

  // @ts-ignore
  app.post("/formdata", addShopValidation, async (req, res) => {
    res.redirect(`/auth?shop=${req.body.shop_name}`);
  });

  // @ts-ignore
  app.use(router);

  // @ts-ignore
  app.use((req, res, next) => {
    const shop = req.query.shop;
    if (Shopify.Context.IS_EMBEDDED_APP && shop) {
      res.setHeader(
        "Content-Security-Policy",
        `frame-ancestors https://${shop} https://admin.shopify.com;`
      );
    } else {
      res.setHeader("Content-Security-Policy", `frame-ancestors 'none';`);
    }
    next();
  });

  // @ts-ignore
  app.use("/*", (req, res, next) => {
    const shop = req.query.shop;

    // Detect whether we need to reinstall the app, any request from Shopify will
    // include a shop in the query parameters.
    // @ts-ignore
    if (app.get("active-shopify-shops")[shop] === undefined && shop) {
      res.redirect(`/auth?shop=${shop}`);
    } else {
      next();
    }
  });

  app.use(errorMiddleware);

  /**
   * @type {import('vite').ViteDevServer}
   */
  let vite;
  if (!isProd) {
    vite = await import("vite").then(({ createServer }) =>
      createServer({
        root,
        logLevel: isTest ? "error" : "info",
        server: {
          port: PORT,
          hmr: {
            protocol: "ws",
            host: "localhost",
            port: 64999,
            clientPort: 64999,
          },
          middlewareMode: "html",
        },
      })
    );
    // @ts-ignore
    app.use(vite.middlewares);
  } else {
    // @ts-ignore
    const compression = await import("compression").then(
      ({ default: fn }) => fn
    );
    // @ts-ignore
    const serveStatic = await import("serve-static").then(
      ({ default: fn }) => fn
    );
    const fs = await import("fs");
    // @ts-ignore
    app.use(compression());
    // @ts-ignore
    app.use(serveStatic(resolve("dist/client")));
    // @ts-ignore
    // @ts-ignore
    app.use("/*", (req, res, next) => {
      // Client-side routing will pick up on the correct route to render, so we always render the index here
      res
        .status(200)
        .set("Content-Type", "text/html")
        .send(fs.readFileSync(`${process.cwd()}/dist/client/index.html`));
    });
  }

  // @ts-ignore
  return { app, vite };
}

if (!isTest) {
  // @ts-ignore
  createServer().then(({ app }) => app.listen(PORT));
}
