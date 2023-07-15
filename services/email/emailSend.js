const nodemailer = require("nodemailer");

const sendMail = async ({
  sender,
  receiversEmail,
  messageText,
  messageHtml,
  subject,
}) => {
  // Import Email and password from .env (This account is used to send mail)
  const email = process.env.SENDER_EMAIL_ID;
  const password = process.env.EMAIL_PASSWORD;

  // Check that all fields are present or not
  if (!sender || !receiversEmail || !messageText || !messageHtml || !subject) {
    throw new Error("All fields are required");
  }

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: email,
        pass: password,
      },
    });

    // send mail with defined transport object
    const info = await transporter.sendMail({
      from: `${sender} <${email}>`,
      to: receiversEmail,
      subject: subject,
      text: messageText, // plain text body
      html: messageHtml, // html body
    });

    return {
      success: true,
      info,
    };
  } catch (error) {
    throw new Error(error || "Unable to send Email");
  }
};

module.exports = {
  sendMail,
};
