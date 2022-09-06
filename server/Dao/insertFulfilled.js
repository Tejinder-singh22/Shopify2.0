import fulfilledOrder from "../model/ordersModel.js";
/**
 * inserting fullfilled order in Db;
 * @param  [type] order         [object]
 * @param  [type] currentShop   [string]
 * @return [type]               [void]
 */
export default async function insertFulfilled(order, currentShop) {
  let myorder = new fulfilledOrder({
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
    created_at: order.created_at,
    updated_at: order.updated_at,
  });

  //validation
  try {
    var user = await fulfilledOrder.findOne({ order_id: order.id });
  } catch (error) {
    console.log(error);
  }

  if (user) {
    fulfilledOrder.findOneAndUpdate(
      { order_id: order.id },
      {
        first_name: order.billing_address.first_name,
        fulfillment_status: order.fulfillment_status,
        shop_name: currentShop,
        order_data: order,
        order_token: order.token,
        cart_token: order.cart_token,
        checkout_token: order.checkout_token,
        line_items: order.line_items,
        updated_at: order.updated_at,
      },
      { new: true },
      (error, data) => {
        if (error) {
          console.log(error);
        } else {
          console.log("order updated successfully");
          // console.log(data)
        }
      }
    );
  } else if (order.fulfillment_status != null) {
    try {
      console.log("fullfilled order inserted succesfully");
      myorder.save();
    } catch (error) {
      console.log(error);
    }
  }
}
