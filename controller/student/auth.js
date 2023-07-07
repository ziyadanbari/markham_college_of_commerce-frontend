const handleStudentLogin = (req, res) => {
  res.send("Student Login");
};

const handleStudentSignup = (req, res) => {
  res.send("Student Signup");
};

module.exports = {
  handleStudentLogin,
  handleStudentSignup,
};
