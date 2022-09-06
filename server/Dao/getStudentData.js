import Student from "../model/studentsModel.js";
/**
 * Getting student data by matching cart Token, from DB;
 * @param  [type] uniqueSessionId       [string]
 * @param  [type] cart_token            [string]
 * @return [type]                       [promise]
 */
export default async function getStudentData(_field, fieldValue) {
  try {
    var data = await Student.findOne(
      { _field: fieldValue },
      { created_at: 0, updated_at: 0, _id: 0, __v: 0 }
    );
  } catch (error) {
    console.log(error);
  }

  return new Promise(function (resolve, reject) {
    if (data) {
      resolve(data);
    } else {
      reject(
        `cannot fetch Student data containing cart_token  from student Table`
      );
    }
  });
}
