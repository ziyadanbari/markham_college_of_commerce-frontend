const { v4: uuidv4 } = require("uuid");

const mapData = new Map();

// Generate otp
const generateOTP = (digit) => {
  const upperLimit = Math.pow(10, digit);
  const lowerLimit = upperLimit / 10;
  
  return Math.floor(lowerLimit + Math.random() * (upperLimit - lowerLimit));
};

/**
 * @param {Object} userData - user data object
 * @returns {Object} - success, sessionId and otp
 *
 */
const setOtp = (userData) => {
  const time = new Date(); // current time
  const otp = generateOTP(6); // generate otp
  const sessionId = uuidv4(); // generate sessionId

  //if NODE_ENV is not production then log opt in console
  if (process.env.NODE_ENV !== "production") {
    console.log(`otp: ${otp}`);
  }

  // map option with userData, otp, otpExpireTime, attempt
  const userDataOption = {
    data: userData,
    otp: otp,
    otpExp: time.getTime() + 10 * 60000,
    attempt: 0,
  };

  mapData.set(sessionId, userDataOption);
  return { sessionId, otp };
};

/**
 * @param {String} sessionId - which is return from setOtp function
 * @returns {Object} - success, otp and email
 */
const getOtp = (sessionId) => {
  const savedData = mapData.get(sessionId);
  if (!savedData) {
    return {
      success: false,
      message: "Cannot send OTP, please go back and try and again",
    };
  }
  return {
    success: true,
    otp: savedData.otp,
    email: savedData.data.email,
  };
};

/**
 *
 * @param {String} sessionId
 * @param {String} userOtp
 * @returns
 */
const verifyOtp = async (sessionId, userOtp) => {
  const savedData = mapData.get(sessionId);

  // if sessionId Not found in map
  if (!savedData) {
    return {
      success: false,
      message: "Unable to verify, please go back and try and again",
    };
  }

  const time = new Date();
  const timeNow = time.getTime();

  if (timeNow > savedData.otpExp) {
    mapData.delete(sessionId);
    return {
      success: false,
      message: "otp is expired",
    };
  }

  if (savedData.attempt > 4) {
    mapData.delete(sessionId);
    return {
      success: false,
      message: "maximum attempts are reached",
    };
  }

  // Check if opt is not match to saved otp it return with 401 [401 => OTP is not valid ( Unauthorized )]
  if (Number.parseInt(userOtp) === savedData.otp) {
    mapData.delete(sessionId);
    return {
      success: true,
      userData: savedData.data,
    };
  } else {
    savedData.attempt++;
    mapData.set(sessionId, savedData);
    return {
      success: false,
      message: `wrong otp you have ${5 - savedData.attempt} attempt left`,
    };
  }
};

module.exports = {
  setOtp, // This function is used to set otp in map and return sessionId and otp
  getOtp, // This function is used to get otp from map with the help of sessionId use in resend otp
  verifyOtp, // This function is used to verify otp with the help of sessionId and otp
};
