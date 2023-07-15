const { validationResult } = require("express-validator");
const Student = require("../../model/student");
const { createJwtToken } = require("../../auth/jwtToken");
const { setOtp, verifyOtp } = require("../../services/otp");
const { sendMail } = require("../../services/email/emailSend");
const {
  otpEmailTemplate,
} = require("../../services/email/emailHtmlTemplates/otpEmailTemplate");

const handleStudentSignup = async (req, res) => {
  // Checking, Every Details is Valid or Not
  const isEveryDetailsValid = validationResult(req);

  // If Not Valid, Then Send Error
  if (!isEveryDetailsValid.isEmpty()) {
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

    // If Student is not registered, Then Send otp
    const { sessionId, otp } = setOtp({
      firstName,
      lastName,
      email,
      password,
      phoneNumber,
      program,
    });

    // /**
    //  * Send otp on email
    //  */

    // Importing email template
    const { html, text } = otpEmailTemplate(otp);

    let mailPayload = {
      sender: `Markham College of commerce`,
      receiversEmail: email,
      subject: `Registration OTP is ${otp}`,
      messageText: text,
      messageHtml: html,
    };

    // Send email
    const send = await sendMail(mailPayload);

    // Check if email sending was successful
    if (!send.success) {
      return res.status(500).send({
        success: false,
        message: "Unable to send opt",
      });
    }

    // Sending the response
    return res.status(200).json({
      success: true,
      message: "OTP send on your email",
      sessionId: sessionId,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

const handleStudentSignupOtpVerify = async (req, res) => {
  // Checking, Every Details is Valid or Not
  const isEveryDetailsValid = validationResult(req);

  // If Not Valid, Then Send Error
  if (!isEveryDetailsValid.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: isEveryDetailsValid.array()[0].msg,
    });
  }

  const sessionId = req.headers.sessionid;
  const { otp } = req.body;

  try {
    // Verifying the otp
    const { success, message, userData } = await verifyOtp(sessionId, otp);

    // If otp is not verified, Then Send Error
    if (!success) {
      return res.status(401).json({
        success: false,
        message: message,
      });
    }

    // If otp is verified, Then Create a new Student
    const newStudent = new Student(userData);

    // Saving the new Student
    await newStudent.save();

    // Creating a new jwt token
    const jwtToken = createJwtToken({
      id: newStudent._id,
      email: newStudent.email,
      name: newStudent.firstName + " " + newStudent.lastName,
      role: "student",
    });

    // Sending the response
    return res.status(200).json({
      success: true,
      message: "Student created successfully",
      authorization: jwtToken,
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
  handleStudentSignupOtpVerify,
};
