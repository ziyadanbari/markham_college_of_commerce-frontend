const { validationResult } = require("express-validator");
const Student = require("../../model/student");
const { createJwtToken } = require("../../auth/jwtToken");

const handleStudentSignup = async (req, res) => {
  // Checking, Every Details is Valid or Not
  const isEveryDetailsValid = validationResult(req);

  // If Not Valid, Then Send Error
  if (!isEveryDetailsValid.isEmpty()) {
    console.log("something is wrong here");
    return res.status(400).json({
      success: false,
      message: isEveryDetailsValid.array()[0].msg,
    });
  }

  const { firstName, lastName, email, password, phoneNumber, program } =
    req.body;

  try {
    // Checking if Student is already registered or not with the same email or phone
    const isStudentAlreadyRegistered = await Student.findOne({
      $or: [{ email }, { phoneNumber }],
    });

    // If Student is already registered, Then Send Error
    if (isStudentAlreadyRegistered) {
      return res.status(409).json({
        success: false,
        errorType: "Conflict",
        message: "Student already exist",
      });
    }

    // Creating a new Student
    const newStudent = await Student.create({
      firstName,
      lastName,
      email,
      password,
      phoneNumber,
      program,
    });

    const payload = {
      ...newStudent._doc,
      password: "",
    };
    const jwtToken = createJwtToken(payload);

    // Sending the response
    return res.status(201).json({
      success: true,
      message: "Student Signup",
      Student: payload,
      jwtToken,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

module.exports = {
  handleStudentSignup,
};
