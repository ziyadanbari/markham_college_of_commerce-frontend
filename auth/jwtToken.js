const jwt = require("jsonwebtoken");
require("dotenv").config();
const jwtSecretKey = process.env.JWT_PRIVATE_KEY;

const createJwtToken = (payload, expiresIn) => {
  return jwt.sign(payload, jwtSecretKey, {
    expiresIn: expiresIn ? expiresIn : null,
  });
};

const verifyJwtToken = (token) => {
  try {
    return jwt.verify(token, jwtSecretKey);
  } catch (error) {
    return null;
  }
};

module.exports = {
  createJwtToken,
  verifyJwtToken,
};
