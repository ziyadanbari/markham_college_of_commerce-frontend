const { default: mongoose } = require("mongoose");

const connectDB = (MONGODB_URI) => {
  const uri = MONGODB_URI;
  mongoose
    .connect(uri)
    .then(() => "mongodb connected")
    .catch((err) => {
      throw new Error(err);
    });
};

module.exports = connectDB;
