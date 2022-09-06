
import mongoose from "mongoose";
mongoose.connect('mongodb://localhost:27017/admin',
{
  // @ts-ignore
  useNewUrlParser: true,
  useUnifiedTopology: true
}
);

const db = mongoose.connection;
export default db;