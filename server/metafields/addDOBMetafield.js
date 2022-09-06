import createRequest from "../Requests/createRequest.js";
/**
 * Adding Dob metafields for orders
 * @param  [type] dob           [string]
 * @param  [type] dataExtractId [number]
 * @param  [type] orders        [string]
 * @param  [type] currentShop   [string]
 * @return [type]               [void]
 */
export default function addDOBMetafield(
  value,
  sourceId,
  resourceType,
  currentShop
) {
  var metaField = {};
  metaField.metafield = new Object({
    namespace: "profile",
    type: "single_line_text_field",
  });
  //  console.log('i am making meta object-2');
  /**
   * Generate DOB Metajason Key;
   */
  let requestData = getDateOfBirthMetaJson(value);
  if (requestData != null && requestData != undefined) {
    // console.log('Passing in createRequest-5');
    let resourceId = sourceId;
    createRequest("POST", requestData, resourceType, resourceId, currentShop)
      .then((data) => {
        return data;
      })
      .catch((error) => {
        console.log(error + " of DOB Meta");
      });
  }
  /**
   * Generate DOB Metajason Key;
   * @param  [type] value         [object]
   * @return [type]               [object]
   */
  function getDateOfBirthMetaJson(value) {
    // console.log('get Date of birth-3');
    return generateMetaJson("date_of_birth", value);
  }
  /**
   * Generate Metajason Key and value;*/
  function generateMetaJson(key, value) {
    if (
      key != null &&
      key != undefined &&
      value != null &&
      value != undefined
    ) {
      // console.log('generating Metafield-4');
      metaField.metafield.key = key;
      metaField.metafield.value = value;
    } else {
      console.log("SORRY in generate metafield");
      return false;
    }

    return metaField;
  }
}
