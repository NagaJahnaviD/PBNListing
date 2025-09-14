const mongoose = require("mongoose");
const AdminAccount = require("./models/adminAccountModel"); // path to your model
require("dotenv").config();

const DBURL = process.env.DBURL || "mongodb://localhost:27017/openpixel_pbnisting";

async function createAdmin() {
  try {
    await mongoose.connect(DBURL, { useNewUrlParser: true, useUnifiedTopology: true });

    const admin = new AdminAccount({
      adminId: 2,
      username: "admin1",
      email: "admin1@example.com",
      password: "123456" // will be hashed automatically
    });

    await admin.save();
    console.log("Admin created successfully with hashed password!");
    mongoose.disconnect();
  } catch (err) {
    console.error(err);
    mongoose.disconnect();
  }
}

createAdmin();
