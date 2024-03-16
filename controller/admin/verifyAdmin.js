const { validationResult } = require("express-validator");
const { verifyJwtToken } = require("../../auth/jwtToken.js");
const Admin = require("../../model/admins.js");

async function verifyAdmin(req, res) {
  // Check if request is correct

  const validation = validationResult(req);

  // If Not Valid, Then Send Error
  if (!validation.isEmpty()) throw [400, validation.array()[0].msg];

  const authorizationPart = req.headers.authorization.split(" ");

  if (
    !authorizationPart ||
    authorizationPart.length !== 2 ||
    authorizationPart[0] !== "Bearer"
  )
    throw [401, "AuthorizationPart is not valid"];

  const token = authorizationPart[1];

  const admin = verifyJwtToken(token);

  if (!admin) {
    throw [401, "Invalid Token"];
  }

  const adminDetails = await Admin.findById(admin.id);

  if (!adminDetails) {
    throw [401, "Invalid Token"];
  }

  const payload = {
    id: adminDetails._id,
    username: adminDetails.username,
  };

  res.status(200).send({
    success: true,
    message: "Admin Verified Successfully",
    admin: payload,
  });
}

module.exports = verifyAdmin;
