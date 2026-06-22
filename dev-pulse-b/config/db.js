const mongoose = require("mongoose");


async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGO_URI || "mongodb://127.0.0.1:27017/dev_pulse");

    console.log("MongoDB connected successfully");
    console.log("Connected Database:", mongoose.connection.name);
  } catch (err) {
    console.log(err);
  }
}

module.exports = connectDB;
