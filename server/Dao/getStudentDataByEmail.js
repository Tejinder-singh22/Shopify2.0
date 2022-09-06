import Student from "../model/studentsModel.js";
/**
 * Get Students data from db by matching email
 * @param  [type] formData               [string]
 * @param  [type] orderCustomerEmail     [string]
 * @return [type]                        [promise object]
 */
// fetch Student data from Database
export default async function getStudentDataByEmail(_field, Order_email) {
  try {
    var data = await Student.findOne({
      formData: { $elemMatch: { email: Order_email } },
    });
  } catch (error) {
    console.log(error);
  }

  return new Promise(function (resolve, reject) {
    if (data) {
      resolve(data);
    } else {
      reject(`cannot fetch Student data containing  from student Table`);
    }
  });
}
