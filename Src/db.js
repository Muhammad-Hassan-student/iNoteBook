const mongoose = require("mongoose");
const mongoURI =
//please connect your  Monbo Db compass 
  "mongodb+srv://@cluster0.5tfjlqj.mongodb.net/inotebook_api";

const connectDb = async () => {
  try {
    await mongoose.connect(mongoURI);
    console.log("connection is successfully");
  } catch (error) {
    console.error("connnection failed");
    process.exit(0);
  }
};
module.exports = connectDb;
