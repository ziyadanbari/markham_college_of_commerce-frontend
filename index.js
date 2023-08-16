const express = require("express");
require("dotenv").config({ path: ".env.local" });
const cors = require("cors");
const connectDB = require("./dbConnect");
const { checkEnv4Production, checkEnv4Development } = require("./checkEnvVar");
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
app.use(express.json());
app.use(
  cors({
    origin: process.env.CLIENT_URL?.split(","),
  })
);

// Routes
app.use("/student", require("./routes/student"));
app.use("/", require("./routes/common"));

// Middleware for handling unmatched routes
app.use((req, res, next) => {
  res.status(404).send({
    success: false,
    error: 404,
    method: req.method,
    message: `Endpoint not found. If you think something broken then please contact the developer.`,
  });
});

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
