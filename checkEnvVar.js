// Check for all the required environment variables in production
const checkEnv4Production = () => {
  // All required environment variables in
  const requiredEnvVars = [
    "PORT",
    "MONGO_URI",
    "JWT_PRIVATE_KEY",
    "SENDER_EMAIL_ID",
    "EMAIL_PASSWORD",
    "CLIENT_URL",
  ];

  // filter missing environment variables
  const missingEnvVars = requiredEnvVars.filter(
    (varName) => !process.env[varName]
  );

  if (missingEnvVars.length > 0) {
    console.log(`Missing environment variables: ${missingEnvVars.join(", ")}`);
    process.exit(1);
  } else {
    console.log(
      "Great! All required environment variables for production are present"
    );
  }
  return;
};

const checkEnv4Development = () => {
  const requiredEnvVars = [
    "PORT",
    "MONGO_URI",
    "JWT_PRIVATE_KEY",
    "NODE_ENV",
    "CLIENT_URL",
  ];

  const missingEnvVars = requiredEnvVars.filter(
    (varName) => !process.env[varName]
  );

  if (missingEnvVars.length > 0) {
    console.log(`Missing environment variables: ${missingEnvVars.join(", ")}`);
    process.exit(1);
  } else {
    console.log(
      "Great! All required environment variables for development are present"
    );
  }
  return;
};

module.exports = {
  checkEnv4Production,
  checkEnv4Development,
};
