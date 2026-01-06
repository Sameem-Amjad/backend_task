import { logger } from '../../logger/logger.js';
import sgMail from '@sendgrid/mail';
import { ENV } from '../../constants/ENV.js';

sgMail.setApiKey(ENV.SENDGRID_API_KEY);

export const sendVerificationEmail = async (email: string, otp: string) => {
  try {
    await sgMail.send({
      to: email,
      from: ENV.SENDGRID_EMAIL,
      templateId: ENV.SENDGRID_OTP_TEMPLATE_ID,
      dynamicTemplateData: {
        otp: otp,
        year: new Date().getFullYear(),
      },
    });

    logger.info(`Verification email sent to ${email}`);
  } catch (error) {
    logger.error('Error sending verification email', error);
  }
};
