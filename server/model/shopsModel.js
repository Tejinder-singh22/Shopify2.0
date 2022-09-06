
import mongoose  from "mongoose";
const shopSchema = new mongoose.Schema({
  shop_name: {
    type: String,
    required: true,
  },
  client_id: {
    type: String,
    default: 0,
  },
  app_status: {
    type: Boolean
  },
  access_token: {
      type: String
  },
  host: {
    type: String
  },
  shop_id: {
    type: String
  },
  shop_state: {
    type: String
  },
  isOnline: {
    type: Boolean
  },
  scope: {
    type: String
  },
  expires: {
    type: Date
  },
  access_expire: { 
    type: Number
  },
  user_scope: {
    type: String
  },
  session: {
    type: String
  },
  account_number: {
    type: Number
  },
  associated_id: {
    type: Number
  },
  associated_first_name: {
    type: String
  },
  associated_last_name: {
   type: String
  },
  associated_email: {
    type: String
  },
  associated_account_owner: {
    type: Boolean
  },
  associated_locale: {
    type: String
  },
  associated_collaborator: {
    type: Boolean
  },
  associated_email_verified: {
    type: Boolean
  },
  created_at: {
    type: Date
  }
  
  

}, {collection: 'app_data'})

const Shop = mongoose.model("shopSchema", shopSchema)

export default Shop;
 