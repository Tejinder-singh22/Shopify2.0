
 
import mongoose  from "mongoose";
const studentSchema = new mongoose.Schema({
  shop_name:{
    type: String,
    required: true,
  },
  uniqueSessionId: {
    type: String,  
  },
  formData: {
    type: Array,
  },
  serverRequestData: {
    type: String,
  },
  created_at: {
    type: Date
  },
  updated_at: {
    type: Date
  }

}, {collection: 'student_data'})

const Student = mongoose.model("studentSchema", studentSchema)

export default Student;
 