const { Schema, default: mongoose } = require("mongoose");

const adminSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      trim: true,
      min: 3,
      max: 30,
    },
    password: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Admin = mongoose.model("admins", adminSchema);

module.exports = Admin;
