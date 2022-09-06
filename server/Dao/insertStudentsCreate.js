import Student from "../model/studentsModel.js";
/**
 * Insertion of Student from form which was filled at first step (theme)
 * @param  [type] Student     [description]
 * @param  [type] currentShop [description]
 * @return [type]             [void]
 */
export default async function insertStudentsCreate(student, currentShop) {
  let mycustomer = new Student({
    shop_name: currentShop,
    uniqueSessionId: student.token,
    formData: student,
    serverRequestData: "server info",
    created_at: new Date(),
    updated_at: new Date(),
  });

  //validation
  const user = await Student.findOne({ uniqueSessionId: student.token });
  if (user) {
    Student.findOneAndUpdate(
      { uniqueSessionId: student.token },
      {
        formData: student,
        serverRequestData: "server info",
        updated_at: new Date(),
      },
      { new: true },
      (error, data) => {
        if (error) {
          console.log(error);
        } else {
          console.log("student updated successfully");
          console.log(data);
        }
      }
    );
  } else {
    try {
      console.log("new student inserted succesfully");
      // console.log(Student);
      mycustomer.save();
    } catch (error) {
      console.log(error);
    }
  }
}
