import request from "request";

export default function getCustomers(session) {
  var options = {
    method: "GET",
    url: `https://${session.shop}/admin/api/2021-07/customers.json`,
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Access-Token": session.accessToken,
    },
  };
  return new Promise(function (resolve, reject) {
    var customers;
    request(options, function (error, response) {
      if (error) throw new Error(error);
      customers = response.body;
      resolve(customers);
    });
  });
}
