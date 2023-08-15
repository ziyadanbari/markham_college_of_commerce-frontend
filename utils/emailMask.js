/**
 * This function mask the email
 * @param {string} email email id example "yourname34@example.com"
 * @returns {string} mask email "n*****e34@***com"
 */

const handleEmailMasker = (email) => {
  const indexOfAtTheRate = email.indexOf("@");

  return `${email.slice(0, 1)}*****${email.slice(
    indexOfAtTheRate - 3,
    indexOfAtTheRate
  )}@***${email.slice(email.length - 3)}`;
};

module.exports = {
  handleEmailMasker,
};
