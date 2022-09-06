import webhookLog from "../model/webhookLogModel.js";
/**
 * Insertion of Webhook Log
 * @param  [type] order       [obj]
 * @param  [type] currentShop [string]
 * @param  [type] hook_type   [obj]
 * @return [type]             [void]
 */
//insert on webhook fulfillment
export default async function insertWebhookLog(order, currentShop, hook_type) {
  let webhookData = new webhookLog({
    shop_name: currentShop,
    hook_type: hook_type,
    hook_json: order,
    created_at: order.created_at,
  });

  //validation
  try {
    console.log("webhook data inserted succesfully");
    webhookData.save();
  } catch (error) {
    console.log(error);
  }
}
