const express = require("express");
require("dotenv").config({ path: ".env.example" });
require("express-async-errors");
const cors = require("cors");
const connectDB = require("./dbConnect");
const path = require("path");
const { checkEnv4Production, checkEnv4Development } = require("./checkEnvVar");
const apiErrorHandler = require("./utils/apiErrorHandler.js");
const bodyParser = require("body-parser");
const fileUpload = require("express-fileupload");
const app = express();

// Server Connection
const PORT = process.env.PORT;
const MONGO_URI = process.env.MONGO_URI;
const NODE_ENV = process.env.NODE_ENV;

const checkRequiredEnv = () => {
  if (NODE_ENV === "production") {
    checkEnv4Production(); // Check for required env variables for production
  } else {
    checkEnv4Development(); // Check for required env variables for development
  }
  console.log(`App is running in ${NODE_ENV} mode`);
};

checkRequiredEnv();

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(fileUpload());
app.use(
  cors({
    origin: process.env.CLIENT_URL?.split(","),
  })
);
// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, "public")));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
// Routes
app.use("/student", require("./routes/student"));
app.use("/", require("./routes/common"));
app.use("/admin", require("./routes/admin.js"));
app.use("/event", require("./routes/event.js"));

// Middleware for handling unmatched routes
app.use((req, res, next) => {
  res.status(404).send({
    success: false,
    error: 404,
    method: req.method,
    message: `Endpoint not found. If you think something broken then please contact the developer.`,
  });
});
app.use(apiErrorHandler);
//Connect to the database before listening
connectDB(MONGO_URI)
  .then(() => {
    app.listen(PORT, () => {
      console.log("listening for requests PORT@", PORT);
    });
  })
  .catch((err) => {
    console.log("Error while connecting to the database", err);
    process.exit(1);
  });
