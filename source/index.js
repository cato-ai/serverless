module.exports.handler = async (event) => {
  console.log(event.Records[0].Sns, event);
  const axios = require("axios");
  //   console.log("HEHEH", process.env.DB_CONNECTION_URL, process.env.API_KEY);
  try {
    // Send POST request
    const DOMAIN = process.env.DOMAIN;
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
          password: process.env.API_KEY,
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
