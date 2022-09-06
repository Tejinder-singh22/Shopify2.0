import insertStudentsCreate from "../Dao/insertStudentsCreate.js";
/**
 * Controller contains logic for handling form data which we entered during checkout;
 * @param  [type] $Student           [object]
 * @param  [type] $currentShop       [string]
 * @param  [type] $res               [obj]
 * @return [type]                    [object]
 */
export default function formController(Student, currentShop) {
  if (
    (Student != null && Student.token != null && currentShop != null) ||
    currentShop != undefined
  ) {
    insertStudentsCreate(Student, currentShop);

    let obj = {
      checkout: {
        shipping_address: {
          first_name: Student.firstname ?? "",
          last_name: Student.lastname ?? "",
          email: Student.email ?? "",
          phone: Student.mobileNumber ?? "",
          company: Student.companyName ?? "",
          address1: Student.address ?? "",
          city: Student.city ?? "",
          zip: Student.zipcode ?? "",
        },
        email: Student.email,
      },
    };
    let shipping_address = [];
    shipping_address["shipping_address"] = Student;
    // returnResponse['checkout']['email'] = db->escapeString(_POST['email']);
    return obj;
  } else {
    return "failed";
  }
}
