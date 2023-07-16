const { validationResult } = require("express-validator");
const Student = require("../../model/student");
const { createJwtToken } = require("../../auth/jwtToken");

const handleStudentSignIn = async (req, res) => {
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
    const { email, password } = req.body; // get email and password from request body

    // check if user exist or not
    const user = await Student.findOne({ email });

    // if user not found
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "No account found with this email",
      });
    }

    console.log("password", password);
    console.log("saved password", user.password);
    // if password is incorrect
    if (user.password !== password) {
      return res.status(401).json({
        success: false,
        message: "Password is incorrect",
      });
    }

    // create jwt token
    const token = createJwtToken({
      id: user._id,
      email: user.email,
      name: user.firstName + " " + user.lastName,
      role: "student",
    });

    // Sending success response
    res.status(200).send({
      success: true,
      message: "Login Successful",
      authorization: token,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

module.exports = {
  handleStudentSignIn,
};
