import express from "express";
const router = express.Router();
import formController from "../controller/formController.js";
import orderWebhookController from "../controller/orderWebhookController.js";
import checkoutWebhookController from "../controller/checkoutWebhookController.js";
import appUninstalledController from "../controller/appUninstalledController.js";
import listOrdersController from "../controller/listOrdersController.js";
import listStudentsController from "../controller/listStudentsController.js";
import listLogsController from "../controller/listLogsController.js";
var currentShop;
var sess;
//STEP-6
/* hits on orderFulfillment*/
router.post("/ordersWebhook", async (req, res) => {
  console.log("🎉 We got an order!hjkkklkl");
  try {
    var order = req.body;
    orderWebhookController(order, req);
    res.sendStatus(200);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

//STEP -3
/*hits on checkout webhook*/
router.post("/checkoutWebhook", async (req, res) => {
  console.log("🎉 Checkout order Triggered");
  try {
    const currentShop = req.query.shop;
    console.log(req.body);
    const order = req.body;
    checkoutWebhookController(currentShop, order);
    res.sendStatus(200);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

/* hits on app uninstallation */
router.post("/appUninstalledWebhook", (req, res) => {
  console.log(req.body);
  req.session.destroy();
  console.log("🎉 🎉 🎉APP UNINSTALLED SUCCESSFULLY");
  try {
    const currentShop = req.body.domain;
    appUninstalledController(currentShop);
    res.sendStatus(200);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// @ts-ignore
/* hits on app loading from react*/
router.get("/listOrders", (req, res) => {
  res.set("Access-Control-Allow-Origin", "*");
  // sess = req.session;
  // if (req.session.myshop != null && req.session.myshop != undefined) {
  //   currentShop = req.session.myshop;
  // }

  const currentShop2 = req.query.shop;
  console.log(currentShop2 + " the thing we want ");
  listOrdersController(currentShop2).then(
    (data) => {
      // console.log(data + 'main data');
      res.send(data);
      return false;
    },
    (error) => {
      res.status(500).send(error.message);
    }
  );
});
/* hits on app loading from react*/
router.get("/listLogs", (req, res) => {
  // sess = req.session;
  // if (req.session.myshop != null && req.session.myshop != undefined) {
  //   currentShop = req.session.myshop;
  // }
  const currentShop2 = req.query.shop;
  console.log(currentShop2 + " the thing we want ");
  listLogsController(currentShop2).then((result) => {
    // res.send(data);
    console.log(result + "logs");
    if (result != null) {
      res.json({
        msg: "success",
        status: 200,
        data: result,
      });
    } else {
      res.json({
        msg: "failed",
        status: 400,
        data: result,
      });
    }
    return false;
  });
});

/* hits on app loading from react*/
router.get("/listCustomers", (req, res) => {
  // sess = req.session;
  // if (req.session.myshop != null && req.session.myshop != undefined) {
  //   currentShop = req.session.myshop;
  // }
  const currentShop2 = req.query.shop;
  console.log(currentShop2 + " the thing we want ");
  listStudentsController(currentShop2).then(
    (data) => {
      res.send(data);
      return false;
    },
    (error) => {
      res.status(500).send(error.message);
    }
  );
});

/* hits on checkout form*/
router.post("/demoApp", function (req, res) {
  // sess = req.session;
  console.log('i am in demoApp router')
  res.set("Access-Control-Allow-Origin", "*");
  // console.log(sess);
  // if (req.session.myshop != null && req.session.myshop != undefined) {
  //   currentShop = req.session.myshop;
  // }
  // console.log(currentShop + "haha");
  const currentShop2 = req.query.shop;
  console.log(currentShop2 + " the thing we want at checkout demo app ");
  const Student = req.body;
  var result = formController(Student, currentShop2, res);
  if (result != "failed") {
    res.json({
      msg: "success",
      status: 200,
      data: result,
    });
  } else {
    console.log("shop not found");
    res.json({
      msg: "shop not found",
      status: 400,
    });
  }
});
export default router;
