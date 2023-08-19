const { validationResult } = require("express-validator");
const Student = require("../../model/student");
const { verifyJwtToken } = require("../../auth/jwtToken");

const verifyStudent = async (req, res) => {
  // Checking, Every Details is Valid or Not
  const isEveryDetailsValid = validationResult(req);

  // If Not Valid, Then Send Error
  if (!isEveryDetailsValid.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: isEveryDetailsValid.array()[0].msg,
    });
  }

  try {
    const authorizationPart = req.headers.authorization.split(" ");

    if (
      !authorizationPart ||
      authorizationPart.length !== 2 ||
      authorizationPart[0] !== "Bearer"
    ) {
      return res.status(401).json({
        success: false,
        message: "AuthorizationPart is not valid",
      });
    }

    const token = authorizationPart[1];

    const student = verifyJwtToken(token);

    if (!student) {
      return res.status(401).json({
        success: false,
        message: "Invalid Token",
      });
    }

    const studentDetails = await Student.findById(student.id);

    if (!studentDetails) {
      return res.status(401).json({
        success: false,
        message: "Invalid Token",
      });
    }

    const payload = {
      id: studentDetails._id,
      name: studentDetails.firstName + " " + studentDetails.lastName,
      phone: studentDetails.phoneNumber,
      program: studentDetails.program,
      email: studentDetails.email,
    };

    res.status(200).send({
      success: true,
      message: "Student Verified Successfully",
      student: payload,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

module.exports = {
  verifyStudent,
};
