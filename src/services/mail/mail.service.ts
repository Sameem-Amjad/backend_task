import nodemailer from "nodemailer";
import { ENV } from '../../constants/ENV.js';
import { logger } from '../../logger/logger.js';
import SMTPTransport from "nodemailer/lib/smtp-transport/index.js";
import { getVerificationTemplate } from "../../templates/email.template.js";

export const transporter = nodemailer.createTransport({
  host: ENV.SMTP_HOST,
  port: Number(ENV.SMTP_PORT),
  secure: Number(ENV.SMTP_PORT) === 465,
  auth: {
    user: ENV.SMTP_USER,
    pass: ENV.SMTP_PASS,
  },
  logger: true,
  debug: true,
} as SMTPTransport.Options);

export const sendVerificationEmail = async (email: string, otp: string) => {
  try {
    await transporter.sendMail({
      from: `"Support Team" <${ENV.SMTP_USER}>`,
      to: email,
      subject: 'Verify your email address',
      html: getVerificationTemplate(otp),
    });

    logger.info(`Verification email sent to ${email}`);
  } catch (error) {
    logger.error('Error sending verification email', error);
  }
};

