import request  from "request";
// get orders from shopify api 
 export default function getOrders(session) {
var options = {
    'method': 'GET',
    'url': `https://${session.shop}/admin/api/2022-04/orders.json?status=any`,
    'headers': {
      'Content-Type': 'application/json',
      'X-Shopify-Access-Token': session.accessToken
    }
  };
  return new Promise(function(resolve, reject){
      var orders;
    request(options, function (error, response) {
        if (error) throw new Error(error);
        orders = response.body
        resolve(orders);
    });
  })
 
   
}