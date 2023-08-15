const { default: mongoose } = require("mongoose");

const connectDB = async (MONGO_URI) => {
  try {
    const conn = await mongoose.connect(MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.log("Unable to connect mongodb", error);
    process.exit(1);
  }
};

module.exports = connectDB;
