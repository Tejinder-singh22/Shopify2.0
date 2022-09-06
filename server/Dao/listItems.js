import Log from "../model/storeLogModel.js";
import Order from "../model/ordersModel.js";
import Student from "../model/studentsModel.js";
/**
 * List All logs,orders and students on the table (frontend)
 * @param  [type] currentShop [string]
 * @param  [type] topic       [string]
 * @return [type]             [object]
 */
// fetch Logs from Database
export default async function listItems(currentShop, topic) {
  try {
    var data;
    if (topic == "logs") {
      data = await Log.find({ shop_name: currentShop });
    } else if (topic == "orders") {
      data = await Order.find({ shop_name: currentShop });
    } else if (topic == "students") {
      data = await Student.find({ shop_name: currentShop });
    }
  } catch (error) {
    console.log(error);
  }

  return new Promise(function (resolve, reject) {
    if (data) {
      resolve(data);
    } else {
      reject("cannot fetch Items from db");
    }
  });
}
