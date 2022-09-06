import listItems from "../Dao/listItems.js";
/**
 * Controller contains logic for getting all students data from DB;
 * @param  [type] $currentShop       [string]
 * @return [type]                    [promise]
 */
export default function listStudentsController(currentShop) {
  return new Promise(function (resolve, reject) {
    if (currentShop != null) {
      listItems(currentShop, "students").then(
        (data) => {
          resolve(data);
        },
        (error) => {
          reject("cannot fetch Students from db");
          console.log(error.message);
        }
      );
    }
  });
}
