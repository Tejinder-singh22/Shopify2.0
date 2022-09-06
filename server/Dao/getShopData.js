import Shop from "../model/shopsModel.js";
/**
 * Getting shop data by matching shop from DB;
 * @param  [type] currentShop           [string]
 * @return [type]                       [promise]
 */

export default async function getShopData(currentShop) {
  try {
    var data = await Shop.findOne({ shop_name: currentShop });
  } catch (error) {
    console.log(error);
  }

  return new Promise(function (resolve, reject) {
    if (data) {
      console.log("Fetch shopdata DB-6");
      resolve(data);
    } else {
      reject(`cannot fetch Shop data from shop Table`);
    }
  });
}
