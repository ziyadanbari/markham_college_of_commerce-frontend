const { default: mongoose } = require("mongoose");

const connectDB = (MONGODB_URI) => {
  const uri = MONGODB_URI || "mongodb://127.0.0.1:27017/MarkhamCollege";

  if (!MONGODB_URI) {
    console.error("MONGODB_URI not found");
    console.log("MONGODB try to connect local db at", uri);
  }

  mongoose
    .connect(uri)
    .then(() => console.log("mongodb connected"))
    .catch((err) => console.log("unable to connect mongodb", err));
};

module.exports = connectDB;
