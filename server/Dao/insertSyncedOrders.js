import Order from "../model/ordersModel.js";
/**
 * Insertion of orders from store to our db
 * @param  [type] order       [obj]
 * @param  [type] currentShop [string]
 * @return [type]             [void]
 */
//insert on app installation
export default async function insertOrders(order, currentShop) {
  let myorder = new Order({
    order_id: order.id,
    first_name: order.billing_address.first_name,
    fulfillment_status: order.fulfillment_status,
    shop_name: currentShop,
    order_data: order,
    order_token: order.token,
    cart_token: order.cart_token,
    checkout_token: order.checkout_token,
    line_items: order.line_items,
    source_type: order.source_name,
    created_at: new Date(),
  });

  //validation
  try {
    var user = await Order.findOne({ order_id: order.id });
  } catch (error) {
    console.log(error);
  }

  if (user) {
    console.log("shop name with this order already exists");
  } else {
    try {
      console.log("orders synced succesfully");
      myorder.save();
    } catch (error) {
      console.log(error);
    }
  }
}
