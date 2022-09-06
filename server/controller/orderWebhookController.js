import orderWebhook from "../webhooks/orderWebhook.js";
import orderReccuring from "../webhooks/orderReccuring.js";
/**
 * Controller contains logic for Fulfilled order (webhook);
 * @param  [type] $order       [object]
 * @param  [type] $req         [object]
 * @return [type]              [void]
 */
export default async function orderWebhookController(order, req) {
  var currentShop = req.query.shop;
  var source = req.body.source_name;
  console.log(source + " source name");
  if (order != null && currentShop != null) {
    if (source == "subscription_contract") {
      /**
       * When Order Webhook Hitt then [insert order and create opportunities on the bases of subscription plan (source_name)]
       */
      orderReccuring(order, currentShop);
    } else {
      orderWebhook(order, currentShop);
    }
  }
}
