// server/utils/verifyRecaptcha.js
import axios from "axios";

const verifyRecaptcha = async (token) => {
  try {
    const secret = process.env.RECAPTCHA_SECRET;
    const res = await axios.post("https://www.google.com/recaptcha/api/siteverify", null, {
      params: {
        secret,
        response: token,
      },
    });
    console.log("Verifying token:", token);
    console.log("reCAPTCHA result:", res.data);
    return res.data.success;
  } catch (err) {
    console.error("reCAPTCHA verification failed:", err);
    return false;
  }
};

export default verifyRecaptcha;
