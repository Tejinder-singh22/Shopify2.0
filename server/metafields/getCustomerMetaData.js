import createRequest from "../Requests/createRequest.js";
/**
 * Get students/customer meta Data via customerId and currentshop;
 * @param  [type] orderCustomerId        [object]
 * @param  [type] currentShop            [string]
 * @return [type]                        [promise object]
 */
export default async function getCustomerMetaData(customerId, currentShop) {
  var customerMetaField;
  createRequest("GET", null, "customers", customerId, currentShop)
    .then((data) => {
      customerMetaField = data;
      console.log(
        JSON.stringify(customerMetaField) +
          "customer Metafields in Sales Reccuring"
      );
    })
    .catch((error) => {
      console.log(error + " of DOB Meta");
    });

  if (customerMetaField && customerMetaField.metafields ) {
    var dob;
    var gender;
    customerMetaField.metafields.forEach((metafield) => {
      if (metafield["key"] != null && metafield["key"] == "date_of_birth") {
        dob = new Date(Date.parse(metafield.value) / 1000);
      }
      if (metafield["key"] != null && metafield["key"] == "gender") {
        gender = metafield["value"] ?? "";
      }
    });
  }
  return [{ dob: dob ?? "" }, { gender: gender ?? "" }];
}
