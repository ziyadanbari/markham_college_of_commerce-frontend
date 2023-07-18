// This is the controller for the '/' endpoint. when you hit the '/' endpoint, this controller will be called.
const welcomeMessage = (req, res) => {
  const method = req.method;
  res.status(200).send({
    success: true,
    method: method,
    message: "Everything looks normal here. Enjoy your stay!",
    note: `There is nothing at '${method}: /' endpoint.`,
  });
};

module.exports = welcomeMessage;
