import listItems from "../Dao/listItems.js";
/**
 * Controller contains logic for getting all logs from DB;
 * @param  [type] $currentShop       [string]
 * @return [type]                    [promise]
 */
export default function listLogsController(currentShop) {
  return new Promise(function (resolve, reject) {
    if (currentShop != null) {
      listItems(currentShop, "logs").then(
        (data) => {
          resolve(data);
        },
        (error) => {
          reject("cannot fetch logs from db");
          console.log(error.message);
        }
      );
    }
  });
}
