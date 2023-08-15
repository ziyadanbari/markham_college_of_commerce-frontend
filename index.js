const express = require("express");
require("dotenv").config({ path: ".env.local" });
const cors = require("cors");
const connectDB = require("./dbConnect");
const app = express();

//Routes Import
const studentRouter = require("./routes/student");
const commonRouter = require("./routes/common");

// Server Connection
const PORT = process.env.PORT || console.error("set PORT in .env file");
const MONGO_URI =
  process.env.MONGO_URI || console.error("set MONGO_URI in .env file");

console.log(`app is running in ${process.env.NODE_ENV} mode`);

// Routes
app.use("/student", studentRouter);
app.use("/", commonRouter);

// Middleware
app.use(express.json());
app.use(cors());

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
