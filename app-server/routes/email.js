`use strict`;

const nodemailer = require(`nodemailer`);
const express = require(`express`);
const { winston } = require(`../logging`);

const router = express.Router();

router.route(`/`)
  .post(async (request, response, next) => {
    try {
      const transport = {
        service: `Gmail`,
        auth: {
          user: process.env.EMAIL,
          pass: process.env.EMAIL_PASSWORD
        }
      };

      // const testTransporter = nodemailer.createTestAccount();

      const transporter = nodemailer.createTransport(transport);
      const ready = await transporter.verify();

      if (!ready) {
        winston.error(`mail transporter not ready, aborting`);
        return response.status(503).send(`Error: Your message could not be sent. Please try again later.`);
      }

      const { email, inquiryType, subject, message } = request.body;

      const mail = {
        to: process.env.EMAIL,
        subject: `New Message from Contact Form | ${subject}`,
        text: `email: ${email}\ninquiryType: ${inquiryType}\nsubject: ${subject}\nmessage: ${message}`
      };

      winston.debug(`configuring email options ${mail}`);

      const result = await transporter.sendMail(mail);

      if (result.accepted.length === 1 && result.rejected.length === 0) {
        winston.info(`email successfully sent from ${email}`);
        return response.status(202).send(`Thank you for contacting IEEN. Your email has been successfully sent. Our dedicated team will respond to all inquiries within 1-2 business days.`);
      }
      else {
        winston.error(`message could not be sent; email attempt was not accepted (was rejected)`);
        return response.status(400).send(`Error: Your message could not be sent. Please try again later.`);
      }
    }
    catch (error) {
      return next(error);
    }
  });

module.exports = router;
