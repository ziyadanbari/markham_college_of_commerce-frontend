const { v4: uuidv4 } = require("uuid");

const mapData = new Map();

// Generate otp
const generateOTP = () => {
  return Math.floor(10000 + Math.random() * 90000);
};

// Set otp in map with userData
const setOtp = (userData) => {
  const time = new Date(); // current time
  const otp = generateOTP(); // generate otp
  const sessionId = uuidv4(); // generate sessionId

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

const getOtp = (sessionId) => {
  const savedData = mapData.get(sessionId);
  if (!savedData) {
    return {
      success: false,
      message: "Unable to verify, please go back and try and again",
    };
  }
  return {
    success: true,
    otp: savedData.otp,
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

  const time = new Date();
  const timeNow = time.getTime();

  // if sessionId Not found in map
  if (!savedData) {
    return {
      success: false,
      message: "Unable to verify, please go back and try and again",
    };
  }

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
  setOtp,
  getOtp,
  verifyOtp,
};
