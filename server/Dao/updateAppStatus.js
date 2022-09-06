import Shop from "../model/shopsModel.js";
/**
 * Controller for app updation
 * @param  [type] currentShop [description]
 */
export default async function updateAppStatus(currentShop) {
  console.log("app uninstalled successfuly from " + currentShop);
  try {
    var shop = await Shop.find({ shop_name: currentShop });
  } catch (error) {
    console.log(error);
  }
  if (shop) {
    Shop.findOneAndUpdate(
      { shop_name: currentShop },
      {
        app_status: false,
      },
      { new: true },
      (error, data) => {
        if (error) {
          console.log(error);
        } else {
          console.log("app status updated successfully");
        }
      }
    );
  }
}
