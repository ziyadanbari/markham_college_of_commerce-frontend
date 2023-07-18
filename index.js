const express = require("express");
require("dotenv").config({ path: ".env.local" });
const cors = require("cors");

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

//Routes Import
const studentRouter = require("./routes/student");
const commonRouter = require("./routes/common");
const { default: mongoose } = require("mongoose");

app.use("/student", studentRouter);
app.use("/", commonRouter);

app.get("*", (req, res) => {
  res.status(404).send({
    success: false,
    error: 404,
    method: "get",
    message:
      "Endpoint not found. If you think something broken then please contact the developer.",
  });
});

// Server Connection
const PORT = process.env.PORT || 5000; // 5000 is the default port
const MONGO_URI =
  process.env.MONGO_URI || "mongodb://127.0.0.1:27017/MarkhamCollege"; // MarkhamCollege is the default database for local mongodb

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.log("Unable to connect mongodb", error);
    process.exit(1);
  }
};

//Connect to the database before listening
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log("listening for requests PORT@", PORT);
  });
});
