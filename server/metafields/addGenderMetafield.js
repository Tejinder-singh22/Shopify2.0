import createRequest from "../Requests/createRequest.js";

export default function addGenderMetafield(
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
  //    console.log('i am making meta object-2');
  /**
   * Generate Metajason Key;
   * @param  [type] value         [object]
   * @return [type]               [object]
   */
  const requestData = getGenderMetaJson(value);
  if (requestData != null && requestData != undefined) {
    // console.log('Passing in createRequest-5');
    const resourceId = sourceId;
    createRequest("POST", requestData, resourceType, resourceId, currentShop)
      .then((data) => {
        return data;
      })
      .catch((error) => {
        console.log(error + " of Gender Meta");
      });
  }

  function getGenderMetaJson(value) {
    // console.log('get Date of birth-3');
    /**
     * Generate Metajason Key and value;
     */
    return generateMetaJson("gender", value);
  }

  /**
   * Generate Metajason Key and value;
   * @param  [type] key           [object]
   * @param  [type] value         [object]
   * @return [type]               [object]
   */
  function generateMetaJson(key, value) {
    if (key != null && value != null) {
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
