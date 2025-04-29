import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS,
  },
});

const sendEmail = async (toEmail, disasterName, location, description) => {
  const subject = `🚨 Emergency Alert: ${disasterName} Reported${location ? ` in ${location}` : ""}`;
  const htmlContent = `
    <h2 style="color:red;">🚨 Disaster Alert!</h2>
    <p><strong>Disaster:</strong> ${disasterName}</p>
    ${location ? `<p><strong>Location:</strong> ${location}</p>` : ""}
    ${description ? `<p><strong>Description:</strong> ${description}</p>` : ""}
    <p>Stay safe,<br/>Disaster Alert System</p>
  `;

  try {
    const info = await transporter.sendMail({
      from: process.env.GMAIL_USER,
      to: toEmail,
      subject,
      html: htmlContent,
    });
    console.log("Email sent:", info.response);
  } catch (error) {
    console.error("Failed to send email:", error);
  }
};

export default sendEmail;
