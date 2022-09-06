
 
import mongoose  from "mongoose";
const orderCheckoutSchema = new mongoose.Schema({
  order_id: {
    type: Number,
    required: true,
  },
 order_token: {
    type: String
  },
  shop_name: {
    type: String,
    required: true,
  },
  cart_token: {
    type: String,
  },
  checkout_id: {
    type: String,
    required: true,
  }, 
  line_items: {
    type: Array,
    required: true,
  },
  source_plan_application: {
      type: String,
  },
  hook_json: {
      type: Array,
  },
  created_at: {
    type: Date
  }

}, {collection: 'webhook_checkout'})

const OrderCheckout = mongoose.model("orderCheckoutSchema", orderCheckoutSchema)

export default OrderCheckout;
 