import Shop from "../model/shopsModel.js";
/**
 * insert app data of current store in mongo db
 * @param  [type] session               [obj]
 * @param  [type] host                  [string]
 * @param  [type] apiKey                [string]
 * @return [type]                       [promise void]
 */
export default async function insertData(session, host, apiKey) {
  let myshop = new Shop({
    shop_name: session.shop,
    client_id: apiKey,
    app_status: true,
    access_token: session.accessToken,
    host: host,
    shop_id: session.id,
    shop_state: session.state,
    isOnline: session.isOnline,
    scope: session.scope,
    expires: session.expires,
    access_expire: session.onlineAccessInfo.expires_in,
    user_scope: session.onlineAccessInfo.associated_user_scope,
    session: session.onlineAccessInfo.session,
    account_number: session.onlineAccessInfo.account_number,
    associated_id: session.onlineAccessInfo.associated_user.id,
    associated_first_name: session.onlineAccessInfo.associated_user.first_name,
    associated_last_name: session.onlineAccessInfo.associated_user.last_name,
    associated_email: session.onlineAccessInfo.associated_user.email,
    associated_account_owner:
      session.onlineAccessInfo.associated_user.account_owner,
    associated_locale: session.onlineAccessInfo.associated_user.locale,
    associated_collaborator:
      session.onlineAccessInfo.associated_user.collaborator,
    associated_email_verified:
      session.onlineAccessInfo.associated_user.email_verified,
    created_at: new Date(),
  });

  //validation
  try {
    var user = await Shop.findOne({ shop_name: session.shop });
  } catch (error) {
    console.log(error);
  }

  if (user) {
    Shop.findOneAndUpdate(
      { shop_name: session.shop },
      {
        app_status: true,
        access_token: session.accessToken,
        host: host,
        shop_id: session.id,
        shop_state: session.state,
        isOnline: session.isOnline,
        scope: session.scope,
        expires: session.expires,
        access_expire: session.onlineAccessInfo.expires_in,
        user_scope: session.onlineAccessInfo.associated_user_scope,
        session: session.onlineAccessInfo.session,
        account_number: session.onlineAccessInfo.account_number,
        associated_id: session.onlineAccessInfo.associated_user.id,
        associated_first_name:
          session.onlineAccessInfo.associated_user.first_name,
        associated_last_name:
          session.onlineAccessInfo.associated_user.last_name,
        associated_email: session.onlineAccessInfo.associated_user.email,
        associated_account_owner:
          session.onlineAccessInfo.associated_user.account_owner,
        associated_locale: session.onlineAccessInfo.associated_user.locale,
        associated_collaborator:
          session.onlineAccessInfo.associated_user.collaborator,
        associated_email_verified:
          session.onlineAccessInfo.associated_user.email_verified,
      },
      { new: true },
      (error, data) => {
        if (error) {
          console.log(error);
        } else {
          console.log("app status updated successfully");
          console.log(data);
        }
      }
    );
  } else {
    try {
      console.log("data inserted succesfully");
      myshop.save();
    } catch (error) {
      console.log(error);
    }
  }
}
