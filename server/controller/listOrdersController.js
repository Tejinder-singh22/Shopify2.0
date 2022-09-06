import listItems from "../Dao/listItems.js";
/**
 * Controller contains logic for getting all orders from DB;
 * @param  [type] $currentShop       [string]
 * @return [type]                    [promise]
 */
export default function listOrdersController(currentShop) {
  return new Promise(function (resolve, reject) {
    if (currentShop != null) {
      listItems(currentShop, "orders").then(
        (data) => {
          resolve(data);
        },
        (error) => {
          reject("cannot fetch orders from db");
          console.log(error.message);
        }
      );
    }
  });
}
