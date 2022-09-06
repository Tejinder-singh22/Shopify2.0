import request from "request";
import getShopData from "../Dao/getShopData.js";

export default async function createRequest(
  requestType,
  requestData,
  resourceType,
  resourceId,
  currentShop
) {
  var shopData;
  return getShopData(currentShop)
    .then((data, fields) => {
      if (data != null || data != undefined) {
        shopData = data;
        console.log("get ShopData-7");
        const apiSecretKey = shopData.access_token;
        const requestProtocol = "https://";
        const storeUrl = currentShop;
        const adminUrl = "/admin/api";
        const apiVersion = "/2022-04/";
        const apiRefrence = "metafields.json";
        var requestUrl = `${requestProtocol}${storeUrl}${adminUrl}${apiVersion}${resourceType}/${resourceId}/${apiRefrence}`;

        var options = {
          method: requestType,
          url: requestUrl,
          headers: {
            "X-Shopify-Access-Token": apiSecretKey,
            "Content-Type": "application/json",
          },
        };
        if (requestData != null) {
          options.body = JSON.stringify(requestData);
        }
        return new Promise(function (resolve, reject) {
          request(options, function (error, response) {
            if (error) throw new Error(error);
            if (response.body != null && response.body != undefined) {
              console.log(JSON.stringify(response.body) + " in create request");
              // response.body = JSON.parse(response.body);
              resolve(response.body);
              // console.log(response.body);
              // console.log('i am resolving metafield data-8');
            } else {
              reject("undefined response in Create request");
            }
          });
        });
      }
    })
    .catch((error) => {
      console.log(error + "of meta API");
    });
}
