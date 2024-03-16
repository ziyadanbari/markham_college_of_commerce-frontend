const { validationResult } = require("express-validator");
const { createJwtToken } = require("../../auth/jwtToken.js");
const Admin = require("../../model/admins.js");
const bcrypt = require("bcrypt");
async function login(req, res) {
  // Check if request is correct
  const validation = validationResult(req);
  if (!validation.isEmpty())
    throw [400, validation?.array()[0]?.msg || "Something went wrong"];
  // Destruct username and password from the body
  const { username, password } = req.body;
  // Initialize the wrong credentials error
  const WrongCredentialsError = [401, "Username or Password is incorrect"];
  // fetch user by his username
  const user = await Admin.findOne({ username });
  // check if the user exist
  if (!user) throw WrongCredentialsError;
  // check if the password is correct
  const isHashPasswordMatch = await bcrypt.compare(password, user.password);
  if (!isHashPasswordMatch) throw WrongCredentialsError;
  // Create new json web token
  const token = createJwtToken({ id: user._id });

  // Sending success response
  res.status(200).send({
    success: true,
    message: "Login Successful",
    authorization: "Bearer " + token,
  });
}

module.exports = login;
