const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const adminAccountSchema = new mongoose.Schema({
  adminId: {
    type: Number,
    required: true,
    unique: true,
  },
  username: {
    type: String,
    required: true,
    unique: true,
    minlength: 4,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 6, // ensure reasonably strong password
  },
  role: {
    type: String,
    enum: ["admin"],
    default: "admin",
  },
});

// Hash password before saving
adminAccountSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

// Compare entered password with hashed password
adminAccountSchema.methods.matchPassword = async function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};

const AdminAccount = mongoose.model("AdminAccount", adminAccountSchema);

module.exports = AdminAccount;
