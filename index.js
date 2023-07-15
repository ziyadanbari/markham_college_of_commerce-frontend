const express = require("express");
const connectDB = require("./dbConnect");
require("dotenv").config({ path: ".env.local" });
const cors = require("cors");

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

//Routes Import
const studentRouter = require("./routes/student");
const commonRouter = require("./routes/common");

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
const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/MarkhamCollege"; // MarkhamCollege is the default database for local mongodb

const startServer = async () => {
  try {
    await connectDB(MONGODB_URI);
    console.log("mongodb connected");
    app.listen(PORT, () => {
      console.log(`Server is listening on port ${PORT}`);
    });
  } catch (error) {
    console.log(error);
  }
};

startServer();
