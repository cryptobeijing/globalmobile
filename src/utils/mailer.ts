import nodemailer from 'nodemailer';

interface EmailPayload {
  to: string;
  subject: string;
  html: string;
}

// Configure the email transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Email sending function
export const sendEmail = async (payload: EmailPayload): Promise<void> => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: payload.to,
    subject: payload.subject,
    html: payload.html,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Email sent successfully to ${payload.to}`);
  } catch (error) {
    console.error('Error sending email:', error);
    throw new Error(`Error sending email: ${error}`);
  }
}; 