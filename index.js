const express = require("express");
const { default: mongoose } = require("mongoose");
const connectDB = require("./dbConnect");
require("dotenv").config({ path: ".env.local" });


const app = express();

//Routes
const studentRouter = require("./routes/student");

// Connect to MongoDB
connectDB(process.env.MONGODB_URI);

app.use('/student', studentRouter);

app.get("/", (req, res) => {
  res.send("Hello World!");
});



app.listen(3000, () => {
  console.log("Example app listening on port 3000!");
});
