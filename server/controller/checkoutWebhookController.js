import insertWebhookLog from "../Dao/insertWebhookLog.js";
import insertCheckoutOrder from "../Dao/insertCheckoutOrder.js";
/**
 * Controller contains logic for checkout (webhook);
 * @param  [type] $currentShop       [string]
 * @param  [type] $order             [object]
 * @return [type]                    [void]
 */
//STEP-4
export default function orderWebhookController(currentShop, order) {
  if (currentShop != null && order != null) {
    insertWebhookLog(order, currentShop, "checkout");

    insertCheckoutOrder(order, currentShop);
  }
}
