import getStudentData from "../Dao/getStudentData.js";
import addMetaFields from "../metafields/addMetaFields.js";
import getStudentDataByEmail from "../Dao/getStudentDataByEmail.js";
import insertWebhookLog from "../Dao/insertWebhookLog.js";
import insertFulfilled from "../Dao/insertFulfilled.js";
import SalesForce from "../Salesforce/salesforce.js";
/**
 * When Order Webhook Hitt then [insert order and create opportunities on the bases of subscription plan (source_name)]
 * @param  [type] order        [description]
 * @param  [type] currentShop  [description]
 * @return [type]              [void]
 */
export default async function orderWebhook(order, currentShop) {
  var studentData;
  if (order.cart_token != null && currentShop != null) {
    /* compare studentData via webhook cartToken */
    try {
      /**
       * Getting student data by matching cart Token, from DB;
       */
      var data = await getStudentData("uniqueSessionId", order.cart_token);
    } catch (error) {
      console.log(error.message);
    }
    if (data != null || data != undefined) {
      studentData = data;
      console.log(currentShop + " crrentshop During adding metafields");
      /**
       * Adding metafields
       */
      addMetaFields(data.formData, order, currentShop);
    }

    /* compare studentData via webhook customer email*/
    if (studentData == null || studentData == undefined) {
      try {
        var data = await getStudentDataByEmail(
          "formData",
          order.customer.email
        );
      } catch (error) {
        console.log(error.message);
      }
      if (data != null || data != undefined) {
        studentData = data;
        /**
         * Adding metafields ;
         */
        addMetaFields(data.formData, order, currentShop);
      }
    }
  }
  //STEP-9
  /**
   * Insert Logs in Db on every order creation;
   */
  insertWebhookLog(order, currentShop, "orderCreated");

  console.log("fullfilled order inserted succesfully");
  /**
   * inserting fullfilled order in Db;
   */
  insertFulfilled(order, currentShop);

  /*Embed DOB and Gender Fields in Order data'*/
  if (studentData != null || studentData != undefined) {
    if (studentData.formData != null) {
      order.dob = studentData.formData[0]["dob"];
      order.gender = studentData.formData[0]["gender"];
    }
  }

  // STEP 10;
  /* Sale record class;*/
  const salesforce = new SalesForce();
  salesforce
    .generateToken(currentShop)
    .then((data) => {
      console.log(data);
      console.log(salesforce.accessToken + "line ...50");
      /**
       * creating sales record in salesforce;
       */
      salesforce.createSaleRecord(order).then((data) => {
        if (data != null) {
          console.log(JSON.stringify(data) + "hhhhhhhh");
          //    console.log(data.contactId);
        }
      });
    })
    .catch((error) => {
      console.log(error);
    });
}
