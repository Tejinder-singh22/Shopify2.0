
 
import mongoose  from "mongoose";
const webhookLogSchema = new mongoose.Schema({
  shop_name: {
    type: String,
    required: true,
  },
  hook_type: {
   type: String,
  },
  hook_json: {
      type: Array,
  },
  created_at: {
    type: Date
  }

}, {collection: 'webhook_log'})

const webhookLog = mongoose.model("webhookLogSchema", webhookLogSchema)

export default webhookLog;
 