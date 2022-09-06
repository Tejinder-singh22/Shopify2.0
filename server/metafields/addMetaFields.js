import addDOBMetafield from "../metafields/addDOBMetafield.js";
import addGenderMetafield from "../metafields/addGenderMetafield.js";
/**
 * Adding metafields ;
 * @param  [type] data.formData         [object]
 * @param  [type] order                 [object]
 * @param  [type] currentShop           [string]
 * @return [type]                       [void]
 */
export default function addMetaFields(formData, dataExtract, currentShop) {
  //  console.log('in addMetaFields-1');
  var dob = formData[0].dob;
  var gender = formData[0].gender;
  if (dataExtract.id != null) {
    /**
     * Adding Dob metafields for orders
     */
    addDOBMetafield(dob, dataExtract.id, "orders", currentShop);

    /* Adding Gender metafields for orders*/
    addGenderMetafield(gender, dataExtract.id, "orders", currentShop);

    if (dataExtract.customer != null) {
      /* Adding Dob metafields for customers*/
      addDOBMetafield(dob, dataExtract.customer.id, "customers", currentShop);
      /* Adding Gender metafields for customers*/
      addGenderMetafield(
        gender,
        dataExtract.customer.id,
        "customers",
        currentShop
      );
    }
  }
}
