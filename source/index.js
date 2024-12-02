module.exports.handler = async (event) => {
  // console.log("EHEHEHEHhererererererererererere", process.env.SECRET_NAME);

  console.log(event.Records[0].Sns, event);
  const axios = require("axios");
  const AWS = require("aws-sdk");
  const secretsManager = new AWS.SecretsManager();
  async function getMailgunCredentials() {
    try {
      const secretValue = await secretsManager
        .getSecretValue({ SecretId: process.env.SECRET_NAME })
        .promise();
      return JSON.parse(secretValue.SecretString);
    } catch (error) {
      console.error("Error fetching secrets:", error);
      throw error;
    }
  }

  console.log("Here", process.env.SECRET_NAME);
  //   console.log("HEHEH", process.env.DB_CONNECTION_URL, process.env.API_KEY);
  try {
    // Send POST request
    const secrets = await getMailgunCredentials();
    console.log(secrets, "SECRETSSSS");
    const DOMAIN = secrets.DOMAIN;
    const message = JSON.parse(event.Records[0].Sns.Message);
    const response = await axios.post(
      `https://api.mailgun.net/v3/${DOMAIN}.sampurna.xyz/messages`,
      new URLSearchParams({
        from: "No reply <no-reply@sampurna.xyz>",
        to: message.target_email,
        subject: "Verify Email",
        text: "Click here to verify your account.",
        html: `<html><body><p>${message.email_message}</p></body></html>`,
      }).toString(),
      {
        auth: {
          username: "api",
          password: secrets.API_KEY,
        },
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );
    console.log("Email sent successfully:", response.data);
  } catch (error) {
    console.error(
      "Error sending email:",
      error.response?.data || error.message
    );
    return error;
  }
};
