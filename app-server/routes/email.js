`use strict`;

const nodemailer = require(`nodemailer`);
const express = require(`express`);
const router = express.Router();

router.route(`/`)
  .post(async (request, response, next) => {
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

    if (ready) {
      const { email, inquiryType, subject, message } = request.body;

      const mail = {
        to: process.env.EMAIL,
        subject: `New Message from Contact Form | ${subject}`,
        text: `email: ${email}\ninquiryType: ${inquiryType}\nsubject: ${subject}\nmessage: ${message}`
      };

      const result = await transporter.sendMail(mail);

      if (result.accepted.length === 1 && result.rejected.length === 0) {
        response.status(202).send(`Thank you for contacting IEEN. Your email has been successfully sent. Our dedicated team will respond to all inquiries within 1-2 business days.`);
      }
      else {
        response.status(400).send(`Error: Your message could not be sent. Please try again later.`);
      }
    }
    else {
      response.status(503).send(`Error: Your message could not be sent. Please try again later.`);
    }
  });

module.exports = router;
