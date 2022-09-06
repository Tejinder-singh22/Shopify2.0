import request from "request";

/**
 * creatingwebhook;
 * @param  [type] session         [object]
 * @param  [type] topic           [string]
 * @param  [type] url            [string]
 * @return [type]                 [object]
 */
export default function createWebhook(session, topic, url) {
  var optionss = {
    method: "POST",
    url: `https://${session.shop}/admin/api/2022-04/webhooks.json`,
    headers: {
      "X-Shopify-Access-Token": session.accessToken,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      webhook: {
        topic: topic,
        address: `${process.env.HOST}/${url}?shop=${session.shop}`,
        format: "json",
      },
    }),
  };
  return new Promise(function (resolve, reject) {
    request(optionss, function (error, response) {
      if (error) throw new Error(error);

      resolve(response.body);
    });
  });
}
