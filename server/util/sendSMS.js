import twilio from "twilio";
import dotenv from "dotenv";
dotenv.config();

const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

const formatToE164 = (number) => {
  if (!number.startsWith('+')) {
    return `+91${number}`;
  }
  return number;
};

const sendSMS = async (to, message) => {
  try {
    const formattedNumber = formatToE164(to);
    const response = await client.messages.create({
      body: message,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: formattedNumber,
    });
    console.log("SMS sent:", response.sid);
  } catch (error) {
    console.error("Failed to send SMS:", error.message);
  }
};


export default sendSMS;
