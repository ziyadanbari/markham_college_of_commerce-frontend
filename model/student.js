const { Schema, default: mongoose } = require("mongoose");

const studentSchema = new Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
      min: 3,
      max: 30,
    },
    lastName: {
      type: String,
      trim: true,
      min: 3,
      max: 30,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
    phoneNumber: {
      type: Number,
      required: true,
      trim: true,
      unique: true,
    },
    program: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { timestamps: true }
);

const Student = mongoose.model("student", studentSchema);

module.exports = Student;
