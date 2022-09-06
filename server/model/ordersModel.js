import mongoose from "mongoose";
const orderSchema = new mongoose.Schema(
  {
    order_id: {
      type: Number,
      required: true,
    },
    first_name: {
      type: String,
    },
    fulfillment_status: {
      type: String,
    },
    shop_name: {
      type: String,
      required: true,
    },
    order_data: {
      type: Array,
      required: true,
    },
    order_token: {
      type: String,
      required: true,
    },
    cart_token: {
      type: String,
    },
    checkout_token: {
      type: String,
    },
    line_items: {
      type: Array,
      required: true,
    },
    source_type: {
      type: String,
    },
    created_at: {
      type: Date,
    },
    updated_at: {
      type: Date,
    },
  },
  { collection: "webhook_order" }
);

const Order = mongoose.model("orderSchema", orderSchema);

export default Order;
