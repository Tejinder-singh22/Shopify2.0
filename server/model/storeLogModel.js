
 
import mongoose  from "mongoose";
const storeLogSchema = new mongoose.Schema({
 log_type: {
    type: String
  },
  log_error: {
    type: Array,
    required: true,
  },
  order_id: {
    type: String,
  },
  order_json: {
    type: Array,
    required: true,
  },
  shop_name:{
    type: String,
    required: true,
  },
  created_at: {
    type: Date
  }

}, {collection: 'log_table'})

const storeLog = mongoose.model("storeLogSchema", storeLogSchema)

export default storeLog;
 