import { json } from "express";
import request from "request";
import storeLog from "../Logs/storeLog.js";
import ErrorHandler from "../helpers/errorHandler.js";
class SalesForce {
  clientId =
    "3MVG9jBOyAOWY5bW2ldeqQWvO4LVpDSgnZSu6IKcVQ.ezTkQO35EgmhZVJ0L7BEoagKoKPI9b3MSLzU4NBdVm";
  clientSecret =
    "7F02BF712378D89609A22ABE230469D7E9AF8359876478B8A3EC64436238CA19";
  grantType = "refresh_token";
  refreshToken =
    "5Aep861NK5jh5ZTjZxh8wFtoZlNmviZ4OtVX8GNmLcZGx.NkKdunWipn6SrsMX79pqjzwNCL_TvsWkfXWXdrf0N";

  contentTypeForm = "application/x-www-form-urlencoded";
  contentTypeJson = "application/json";

  tokenApiUrl =
    "https://mindmaxprimary--dev.sandbox.my.salesforce.com/services/oauth2/token";
  contactApiUrl = "/services/data/v50.0/sobjects/Contact";
  opportunityApiUrl = "/services/data/v50.0/sobjects/Opportunity";
  opportunityContactRole =
    "/services/data/v50.0/sobjects/OpportunityContactRole";
  opportunityLineItem = "/services/data/v50.0/sobjects/OpportunityLineItem";
  queryApiUrl = "/services/data/v47.0/query/?q=";
  // password = '';
  username = "tejinder@natives.com";
  accessToken;
  instanceUrl;
  currentShop;
  //STEP-1
  async generateToken(currentShop) {
    this.currentShop = currentShop;
    console.log("i am in generate token");
    var requestData = {
      client_id: `${this.clientId}`,
      client_secret: `${this.clientSecret}`,
      username: `${this.username}`,
      refresh_token: `${this.refreshToken}`,
      grant_type: `${this.grantType}`,
    };
    var res;
    try {
      var data = await this.#sendRequest(
        this.tokenApiUrl,
        "POST",
        this.contentTypeForm,
        requestData
      );
      console.log("token generated " + data);
      data = JSON.parse(data);
      console.log("in perticular  " + data.access_token);
      // const getToken = data;
      if (data.access_token != null) {
        this.accessToken = data.access_token;
        this.instanceUrl = data.instance_url;
        console.log(this.accessToken + "final access token");
        console.log(this.instanceUrl + "final instance url");
        res = "token generated";
      }
    } catch (error) {
      console.log(error.message);
    }

    return new Promise(function (resolve, reject) {
      if (res != null) {
        resolve(res);
      } else {
        reject("token not generated");
      }
    });
  }

  #sendRequest(requestUrl, requestType, requestHeaderType, requestData) {
    console.log("i am in send request");
    var requestAuth = this.accessToken;
    // let postHeader = new Array()
    // postHeader.push(`Content-Type: ${requestHeaderType}`)
    // if (requestAuth != null && requestAuth != undefined) {
    // 	postHeader.push(`Authorization: Bearer ${requestAuth}`)
    // }
    // console.log(postHeader + 'headers printed!!!');

    if (requestHeaderType == this.contentTypeJson) {
      var options = {
        method: requestType,
        url: requestUrl,
        headers: {
          "Content-Type": requestHeaderType,
          Authorization: `Bearer ${requestAuth ?? ""}`,
        },
        body: JSON.stringify(requestData),
      };
    } else {
      var options = {
        method: requestType,
        url: requestUrl,
        headers: {
          "Content-Type": requestHeaderType,
          Authorization: `Bearer ${requestAuth ?? ""}`,
        },
        form: requestData,
      };
    }

    console.log(JSON.stringify(options) + "our main code ");
    return new Promise(function (resolve, reject) {
      request(options, function (error, response) {
        if (error) throw new Error(error);
        console.log(response.statusCode + "line 76");
        if (response.body != undefined) {
          // console.log(response.body + 'line 77');
          resolve(response.body);
        } else {
          reject(response.body);
        }
      });
    });
  }
  //STEP-2
  /**
   * creating sales record in salesforce;
   * @param  [type] order         [object]
   * @return [type]               [object]
   */
  async createSaleRecord(orderData,next) {
    console.log(orderData.id + "we have a orderData line 84");
    try {
      var contactId = await this.#createContact(orderData);
      if (contactId != null) {
        console.log(contactId + "line 87");
      }
      if (contactId != null) {
        const studentData = {};
        studentData.dob = new Date(Date.parse(orderData.dob) / 1000);
        console.log(studentData.dob + "line DATE 113");
        studentData.gender = orderData.gender;

        let mainResult = this.#createOpportunity(orderData, studentData)
          .then((data_2, fields_1) => {
            const opportunityId = data_2;
            if (opportunityId != null) {
              console.log(opportunityId + "finally opportunity id");
              let OpportunityContactRole = this.#createOpportunityContactRole(
                opportunityId,
                contactId,
                orderData
              )
                .then((data_4, fields_2) => {
                  const opportunityContactRole = data_4;
                  console.log(
                    opportunityContactRole +
                    "we got opportunityContactRole line 121 "
                  );
                  let OpportunityLineItem = this.#createOpportunityLineItem(
                    orderData,
                    opportunityId
                  )
                    .then((data, fields) => {
                      const opportunityLineItem = data;
                      console.log(
                        opportunityLineItem +
                        "we have created opportunityLine Item line 122"
                      );
                      const res_1 = {
                        contactId: contactId,
                        opportunityId: opportunityId,
                        opportunityContactRole: opportunityContactRole,
                        opportunityLineItem: opportunityLineItem,
                      };
                      return res_1;
                    })
                    .catch((error) => {
                      console.log(error);
                    });

                  return OpportunityLineItem;
                })
                .catch((error) => {
                  console.log(error);
                });
              return OpportunityContactRole;
            }
          })
          .catch((error) => {
            console.log(error);
          });
        return mainResult;
      }
    } catch (error) {
      console.log(error + "here i am");
    }
    //   console.log('need contact id here'+ contactId);
  }
  /**
   * creating sales record in salesforce;
   * @param  [type] order         [object]
   * @return [type]               [object]
   */
  async createSaleRecurring(orderData,next) {
    console.log('we are in sales Reccuring')
    console.log(orderData.customer['email']+' customers email 1');
    console.log(orderData.customer.email+' customers email 2');
    var response = await this.#isCustomerExist(orderData.customer['email']);
    var contactId;
    console.log(JSON.stringify(response) + 'is customer exists');
    response = JSON.parse(response);
    // contactId = '0032h00000iXb1ZAAS'
    if (response && response.records) {
      if(response.records[0]==null)
       console.log('ERROR contact id not found');
      else
      contactId =  response.records[0]["Id"];
      console.log(contactId +'is customer exists 204');
    }
    if (orderData) {
      var OpportunityName = `${orderData.line_items[0]["sku"]}_${orderData.email}`;
      try {
        var opportunityExist = await this.#isOpportunityExist(OpportunityName);
      } catch (error) {
        console.log(error.message);
      }
      console.log(JSON.stringify(opportunityExist) + "PARENT OPT");
      opportunityExist = JSON.parse(opportunityExist);
      if (opportunityExist != null && opportunityExist.totalSize > 0) {
        // console.log(JSON.stringify(opportunityExist) + "PARENT OPT");

        var parentOppId = opportunityExist.records[0]["Id"];
        console.log(parentOppId + "parentOppId in RECCURING");

        orderData.parentOppId = parentOppId;
        var apiUrl = this.instanceUrl + this.opportunityApiUrl;
        var requestData = this.#createOrderOppJson(orderData, null);
        try {
          var response = await this.#sendRequest(
            apiUrl,
            "POST",
            this.contentTypeJson,
            requestData
          );
        } catch (error) {
          console.log(error.message);
        }
        response = JSON.parse(response);
        if (response.success != null && response.success == true) {
          var opportunityId = response.id;
          console.log(opportunityId + "opportunityId in RECCURING");
          if (opportunityId != null) {
            try {
              var opportunityContactRole =
                await this.#createOpportunityContactRole(
                  opportunityId,
                  contactId,
                  orderData
                );
              console.log(
                opportunityContactRole + "opportunityContactRole in RECCURING"
              );
            } catch (error) {
              console.log(error.message);
            }
            try {
              var opportunityLineItem = await this.#createOpportunityLineItem(
                orderData,
                opportunityId
              );
              console.log(
                opportunityLineItem + "opportunityLineItem in RECCURING"
              );
            } catch (error) {
              console.log(error.message);
            }
            const res_1 = {
              contactId: contactId,
              opportunityId: opportunityId,
              opportunityContactRole: opportunityContactRole,
              opportunityLineItem: opportunityLineItem,
            };
            return res_1;
          }
        } else {
          storeLog(response, orderData, OPPORTUNITY_CREATE_RECURRING);
        }
      }
    }
  }

  #createContact(customerData) {
    console.log(customerData.customer.email + "line salesforce 110");
    var customerId;
    let mainRes = this.#isCustomerExist(customerData.customer.email)
      .then((data, fields) => {
        const response = data;
        console.log(response + "GET req isCustomerExist 144");
        // console.log(response.records + 'in createContact 145');
        if (response) {
          if (response.records != null) {
            console.log(response.records[0]["Id"] + "line salesforce 121");
            customerId = response.records[0]["Id"];
            this.#updateContact(customerData, customerId, apiUrl);
            return new Promise(function (resolve, reject) {
              if (customerId != undefined) {
                resolve(customerId);
              } else {
                reject("undefined customer id");
              }
            });
          } else {
            const apiUrl = this.instanceUrl + this.contactApiUrl;
            let requestData = this.#createCustomerOppJson(customerData);
            // console.log(requestData + 'line 136');
            let contactRes = this.#sendRequest(
              apiUrl,
              "POST",
              this.contentTypeJson,
              requestData
            )
              .then((data, fields) => {
                // console.log(data + 'sucesss salesforce line 126');
                data = JSON.parse(data);
                //	STORE LOG  Remember!!!!!!!!!!!!!!!!!!!!!
                storeLog(data, customerData, "CONTACT_CREATE");
                if (data.success == 1 && data.id != null) {
                  customerId = data.id;
                  this.#updateContact(customerData, customerId, apiUrl);
                }
                return new Promise(function (resolve, reject) {
                  console.log(customerId + " before resolving");
                  if (customerId != null) {
                    // console.log('resolving customer id');
                    resolve(customerId);
                  } else {
                    reject("undefined customer id");
                  }
                });
              })
              .catch((error) => {
                console.log(error + "error in send req");
              });
            return contactRes;
          }
        }
      })
      .catch((error) => {
        console.log(error + "is customer exists");
      });
    return mainRes;
  }

  async #updateContact(customerData, customerId, apiUrl) {
    const requestData = this.updateCustomerOppJson(customerData);
    apiUrl = apiUrl + "/" + customerId;
    var response;
    try {
      response = this.#sendRequest(
        apiUrl,
        "PATCH",
        this.contentTypeJson,
        requestData
      );
    } catch (error) {
      console.log(error);
    }
    //	STORE LOG  Remember!!!!!!!!!!!!!!!!!!!!!
    storeLog(response, customerData, "CONTACT_UPDATE");
  }

  //STEP-3
  #createOpportunity(order, studentData) {
    var opportunityId;
    if (order != null) {
      console.log(order.line_items[0] + "line 194");
      console.log(order.line_items[0]["sku"] + "line 195");
      const OpportunityName = `${order.line_items[0]["sku"]}_${order.email}`;
      let mainRes = this.#isOpportunityExist(OpportunityName)
        .then((data, fields) => {
          let opportunityExist = data;
          console.log(opportunityExist + "GET is Opportunity Exists line 204");
          opportunityExist = JSON.parse(opportunityExist);
          console.log(
            opportunityExist.totalSize + "GET is Opportunity Exists line 251"
          );

          if (
            opportunityExist &&
            opportunityExist.records != null &&
            opportunityExist.totalSize &&
            opportunityExist.totalSize > 0
          ) {
            opportunityId = opportunityExist.records[0]["Id"];
            return new Promise(function (resolve, reject) {
              if (opportunityId != undefined) console.log("opportunity exists");
              resolve(opportunityId);
            });
          } else {
            const apiUrl = this.instanceUrl + this.opportunityApiUrl;
            let requestData = this.#createOrderOppJson(order, studentData);
            let opportunityRes = this.#sendRequest(
              apiUrl,
              "POST",
              this.contentTypeJson,
              requestData
            )
              .then((data, fields) => {
                // console.log(data + 'Opportunity created')
                data = JSON.parse(data);
                //	STORE LOG  Remember!!!!!!!!!!!!!!!!!!!!!
                storeLog(data, order, "OPPORTUNITY_CREATE");
                if (data.success == 1 && data.id != null) {
                  opportunityId = data.id;
                }
                return new Promise(function (resolve, reject) {
                  // console.log(opportunityId +' before resolving');
                  if (opportunityId != undefined) {
                    // console.log('resolving opportunity id');
                    resolve(opportunityId);
                  } else {
                    reject("undefined opportunity id");
                  }
                });
              })
              .catch((error) => {
                console.log(error + "line 281");
              });

            return opportunityRes;
          }
        })
        .catch((error) => {
          console.log(error + "line 231");
        });
      return mainRes;
    }
  }

  async #isOpportunityExist(OpportunityName) {
    var query = this.queryApiUrl;
    query = query + this.#createSearchOpportunityQuery(OpportunityName);
    var apiUrl = this.instanceUrl + query;
    var res;
    try {
      const data = await this.#sendRequest(
        apiUrl,
        "GET",
        this.contentTypeJson,
        []
      );
      res = data;
      return new Promise(function (resolve, reject) {
        if (res != null) {
          resolve(res);
        } else {
          reject("Null Response from api");
        }
      });
    } catch (error) {
      console.log(error);
      console.log("error in is isOpportunityExist line 249 ");
    }
  }

  #createSearchOpportunityQuery(whereConditionValue) {
    return encodeURI(
      `SELECT id, Name  FROM OPPORTUNITY WHERE Name ='${whereConditionValue}'`
    );
  }

  #createOrderOppJson(order, studentData) {
    if (order != null) {
      var gender = order.gender ?? "";
    }
    const obj = {
      Amount: order.total_price ?? "",
      Name: order.line_items[0]["sku"] + "_" + order.email,
      StageName: "Enrolled",
      CloseDate: order.created_at ?? "",
      Parent_Opportunity__c: order.parentOppId ?? "",
    };
    return obj;
  }
  //STEP-4
  #createOpportunityContactRole(opportunityId, contactId, orderData) {
    var ContactRoleId;
    let mainRes = this.#isOpportunityContactRoleExist(opportunityId, contactId)
      .then((data, fields) => {
        const isContactRoleExist = data;
        console.log(
          isContactRoleExist + "GET is OpportunityContactRole Exists line 288"
        );
        if (
          isContactRoleExist &&
          isContactRoleExist.records != null &&
          isContactRoleExist.totalSize &&
          isContactRoleExist.totalSize > 0
        ) {
          ContactRoleId = isContactRoleExist.records[0]["Id"];
          return new Promise(function (resolve, reject) {
            if (ContactRoleId != undefined) console.log("ContactRoleId exists");
            resolve(ContactRoleId);
          });
        } else {
          const apiUrl = this.instanceUrl + this.opportunityContactRole;
          let requestData = this.#createCustomerOppRoleJson(
            opportunityId,
            contactId
          );
          var getContactRoleId = this.#sendRequest(
            apiUrl,
            "POST",
            this.contentTypeJson,
            requestData
          )
            .then((data, fields) => {
              console.log(data + "ContactRole created");
              data = JSON.parse(data);
              if (data.success == 1 && data.id != null) {
                ContactRoleId = data.id;
              } else {
                //	STORE LOG  Remember!!!!!!!!!!!!!!!!!!!!!
                storeLog(data, orderData, "OPPORTUNITY_CREATE_CONTACT_ROLE");
              }
              return new Promise(function (resolve, reject) {
                console.log(ContactRoleId + " before resolving");
                if (ContactRoleId != undefined) {
                  console.log("resolving ContactRoleId ");
                  resolve(ContactRoleId);
                } else {
                  reject("undefined ContactRoleId ");
                }
              });
            })
            .catch((error) => {
              console.log(error + "line 318");
            });
          return getContactRoleId;
        }
      })
      .catch((error) => {
        console.log(error + "line 319");
      });
    return mainRes;
  }

  async #isOpportunityContactRoleExist(OpportunityId, ContactId) {
    var query = this.queryApiUrl;
    query = query + this.#createSearchOpportunityContactRoleQuery(OpportunityId, ContactId);
    var apiUrl = this.instanceUrl + query;
    try {
      var res = await this.#sendRequest(
        apiUrl,
        "GET",
        this.contentTypeJson,
        []
      );
      console.log(res + " in isOpportunityContactRoleExist line 338");
      return new Promise(function (resolve, reject) {
        if (res != null) {
          resolve(res);
        } else {
          reject("null");
        }
      });
    } catch (error) {
      console.log(error);
      console.log("error in is isOpportunityContactRoleExist line 334 ");
    }
  }

  #createSearchOpportunityContactRoleQuery(OpportunityId, ContactId) {
    return encodeURI(
      `SELECT id FROM OpportunityContactRole  WHERE OpportunityId ='${OpportunityId}' and ContactId ='${ContactId}'`
    );
  }

  #createCustomerOppRoleJson(opportunityId, contactId) {
    if (opportunityId != null && contactId != null) {
      const obj = {
        OpportunityId: opportunityId,
        ContactId: contactId,
        Role: "BU Student",
        IsPrimary: "true",
      };
      return obj;
    }
  }
  //STEP-5
  async #createOpportunityLineItem(orderData, opportunityId) {
    var responseBulk = [];
    console.log(orderData.dob + "Last step line 367");
    console.log(orderData.line_items[0]["sku"] + "Last step line 369");
    // console.log(JSON.stringify(orderData)+'Last step line 370');

    if (orderData != null) {
      console.log("in if block");
      try {
        let product2Id = await this.isProductExists(
          orderData.line_items[0]["sku"],
          orderData
        );
        console.log(product2Id + " product2Id line 423");
        let checkproduct = await this.isLineItemExist(
          orderData.line_items[0]["sku"],
          opportunityId
        );
        console.log(checkproduct + "this is our checkproduct value");
        let priceBookEntry = await this.isProductPriceBookEntryExist(
          orderData.line_items[0]["sku"],
          orderData
        );
        console.log(priceBookEntry + " priceBookEntry line 423");
        let apiUrl = this.instanceUrl + this.opportunityLineItem;
        let requestData = this.#createLineItemJson(
          product2Id,
          opportunityId,
          orderData.line_items[0],
          priceBookEntry
        );
        if (checkproduct == false) {
          var response = await this.#sendRequest(
            apiUrl,
            "POST",
            this.contentTypeJson,
            requestData
          ).catch((e) => {
            console.log(e);
          });
          console.log(response + " FINALLLLLL  RESSPONSE");
        }
      } catch (error) {
        console.log(error);
      }

      if (response) {
        response = JSON.parse(response);
      }

      if (response && response.success && response.success == 1) {
        responseBulk = response;
      } else {
        //	STORE LOG  Remember!!!!!!!!!!!!!!!!!!!!!
        storeLog(response, orderData, "OPPORTUNITY_CREATE_LINE_ITEMS");
      }
    }
    console.log(responseBulk + "Line Item response");
    return responseBulk;
  }

  async isProductExists(productSku, order) {
    var query = this.queryApiUrl;
    query = query + this.#createSearchProductQuery(productSku);
    var apiUrl = this.instanceUrl + query;
    try {
      var data = await this.#sendRequest(
        apiUrl,
        "GET",
        this.contentTypeJson,
        []
      );
      console.log(data + " Is product Exist Output");
      data = JSON.parse(data);
      return new Promise(function (resolve, reject) {
        if (data != null && data.totalSize != null && data.totalSize > 0) {
          resolve(data.records[0]["Id"]);
        } else {
          resolve("");
          //	STORE LOG  Remember!!!!!!!!!!!!!
          storeLog(response, order, "OPPORTUNITY_CREATE_LINE_ITEMS_PRODUCT");
        }
      });
    } catch (error) {
      console.log(error);
      console.log("error in is isCustomerExist line 177 ");
    }
    // console.log(data + ' line 168');
  }

  #createSearchProductQuery(whereConditionValue) {
    return encodeURI(
      `SELECT id, Name, ProductCode, IsActive  FROM Product2 WHERE ProductCode ='${whereConditionValue}'`
    );
  }

  async isProductPriceBookEntryExist(productSku, order) {
    var query = this.queryApiUrl;
    query = query + this.#createSearchProductPriceBookEntryQuery(productSku);
    var apiUrl = this.instanceUrl + query;
    var res;
    try {
      const data = await this.#sendRequest(
        apiUrl,
        "GET",
        this.contentTypeJson,
        []
      );
      // console.log(data + ' line 168');
      res = data;
      res = JSON.parse(res);
      return new Promise(function (resolve, reject) {
        if (res != null && res.totalSize != null && res.totalSize > 0) {
          resolve(res.records[0]["Id"]);
        } else {
          resolve("");
          //	STORE LOG  Remember!!!!!!!!!!!!!!!!!!!!!
          storeLog(response, order, "OPPORTUNITY_CREATE_LINE_ITEMS_PRICEBOOK");
        }
      });
    } catch (error) {
      console.log(error);
      console.log("error in is isCustomerExist line 177 ");
    }
  }

  #createSearchProductPriceBookEntryQuery(whereConditionValue) {
    return encodeURI(
      `SELECT id, Name  FROM PriceBookEntry  WHERE ProductCode ='${whereConditionValue}'`
    );
  }

  async #isCustomerExist(customerEmail) {
    var query = this.queryApiUrl;
    query = query + this.#createSearchContactQuery(customerEmail);
    var apiUrl = this.instanceUrl + query;
    var res;
    try {
      const data = await this.#sendRequest(
        apiUrl,
        "GET",
        this.contentTypeJson,
        []
      );
      // console.log(data + ' line 168');
      res = data;
    } catch (error) {
      console.log(error.message);
    }

    return new Promise(function (resolve, reject) {
      if (res != null) {
        resolve(res);
      } else {
        reject("empty result");
      }
    });
  }

  #createSearchContactQuery(whereConditionValue) {
    return encodeURI(
      ` SELECT id, Email, Name  FROM Contact WHERE Email='${whereConditionValue}'`
    );
  }

  #createCustomerOppJson(order) {
    const obj = {
      FirstName: order.shipping_address.first_name ?? "",
      LastName: order.shipping_address.last_name ?? "",
      Email: order.customer.email ?? "",
      Phone: order.shipping_address.phone ?? order.billing_address.phone,
    };
    return obj;
  }

  async isLineItemExist(productCode, oppId) {
    var query = this.queryApiUrl;
    query = query + this.#createLineItemQuery(productCode, oppId);
    var apiUrl = this.instanceUrl + query;
    try {
      var res = await this.#sendRequest(
        apiUrl,
        "GET",
        this.contentTypeJson,
        []
      );
      // console.log(data + ' line 168');
      res = JSON.parse(res);
      console.log(JSON.stringify(res) + " this is isLineItemExists");
    } catch (error) {
      console.log(error);
      console.log("error in is isLineItemExist line 566 ");
    }
    return new Promise(function (resolve, reject) {
      if (res != null && res.totalSize != null && res.totalSize > 0) {
        resolve(true);
      } else {
        reject(false);
      }
    });
  }
  #createLineItemQuery(productCode, oppId) {
    return encodeURI(
      `SELECT Id, OpportunityId from OpportunityLineItem where OpportunityId ='${oppId}' and PricebookEntry.Product2.ProductCode = '${productCode}'`
    );
  }

  updateCustomerOppJson(studentData) {
    const obj = {
      FirstName: studentData.shipping_address.first_name ?? "",
      Pardot_Company__c: studentData.shipping_address.company ?? "",
      LastName: studentData.shipping_address.last_name ?? "",
      Phone:
        studentData.shipping_address.phone ?? studentData.billing_address.phone,
      Preferred_First_Name__c: studentData.first_name ?? "",
      Birthdate: studentData.dob ?? "",
      zBU_Student_Name__c: studentData.customer.first_name ?? "",
      zBU_Student_Gender__c: studentData.gender ?? "",
      Gender__c: studentData.gender ?? "",
      zBU_Student_Email__c: studentData.customer.email ?? "",
      zBU_Student_Birthdate__c: studentData.dob ?? "",
      AccountId: "0032h00000hmz84AAA",                      // of slaesforce
      MailingCity: studentData.shipping_address.city ?? "",
      MailingCountry: studentData.shipping_address.country ?? "",
      MailingLatitude: studentData.shipping_address.latitude ?? "",
      MailingLongitude: studentData.shipping_address.longitude ?? "",
      MailingState: studentData.shipping_address.province ?? "",
      MailingStreet: studentData.shipping_address.address1 ?? "",
      MailingPostalCode: studentData.shipping_address.zip ?? "",
      OtherCity: studentData.billing_address.city ?? "",
      OtherCountry: studentData.billing_address.country ?? "",
      OtherLatitude: studentData.billing_address.latitude ?? "",
      OtherLongitude: studentData.billing_address.longitude ?? "",
      OtherState: studentData.billing_address.province ?? "",
      OtherStreet: studentData.billing_address.address1 ?? "",
      OtherPostalCode: studentData.billing_address.zip ?? "",
      OtherPhone: studentData.billing_address.phone ?? "",
    };
    return obj;
  }

  #createLineItemJson(
    Product2Id,
    opportunityId,
    orderLineItem,
    priceBookEntry
  ) {
    const obj = {
      OpportunityId: opportunityId,
      Product2Id: Product2Id,
      PricebookEntryId: priceBookEntry,
      Quantity: orderLineItem["quantity"],
      UnitPrice: orderLineItem["price"],
    };
    return obj;
  }
}
export default SalesForce;
