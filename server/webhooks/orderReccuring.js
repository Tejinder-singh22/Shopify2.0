import getStudentDataByEmail from "../Dao/getStudentDataByEmail.js";
import getCustomerMetaData from "../metafields/getCustomerMetaData.js";
import SalesForce from "../Salesforce/salesforce.js";
/**
 * When Order Webhook Hitt then [insert order and create opportunities on the bases of subscription plan (source_name)]
 * @param  [type] order        [description]
 * @param  [type] currentShop  [description]
 * @return [type]              [void]
 */
export default async function orderReccuring(order, currentShop) {
  /* compare studentData via webhook cartToken */
  if (order.customer != null && order.customer["id"]) {
    var orderCustomerId = order.customer["id"];
    console.log(orderCustomerId + " orderCustomerId in salesReccuring");
    var orderCustomerEmail = order.customer["email"];
    var response = getCustomerMetaData(orderCustomerId, currentShop);
    // console.log(response.dob + " customer metadata in orderReccuring");
    if (response && response.dob) {
      try {
        /**
         * Get Students data from db by matching email
         */
        var data = await getStudentDataByEmail("formData", orderCustomerEmail);
        if (data != null) {
          response = data.formData;
        }
      } catch (error) {
        console.log(error.message);
      }
    }

    order.dob = response.dob;
    order.gender = response.gender == "F" ? "Female" : "Male";
    console.log(JSON.stringify(order) + "CODE RUNNIG FINE BEFORE SALESFORCE");
  }
  const salesforce = new SalesForce();
  salesforce
    .generateToken(currentShop)
    .then((data) => {
      console.log(data);
      console.log(salesforce.accessToken + "line ...50");
      /**
       * creating sales record in salesforce;
       */
      salesforce.createSaleRecurring(order).then((data) => {
        if (data != null) {
          console.log(JSON.stringify(data) + "hhh RECCURRING hhhhh");
          //    console.log(data.contactId);
        }
      });
    })
    .catch((error) => {
      console.log(error);
    });
}
