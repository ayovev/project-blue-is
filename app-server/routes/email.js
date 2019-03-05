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
        response.status(202).send(`Thank You For Contacting IEEN. Your Email Has Been Successfully Sent. Our Dedicated Team Will Respond To All Inquiries Within 1-2 Business Days.`);
      }
      else {
        response.status(400).send(`Error: Your Message Could Not Be Sent. Please Try Again Later.`);
      }
    }
    else {
      response.status(503).send(`Error: Your Message Could Not Be Sent. Please Try Again Later.`);
    }
  });

module.exports = router;
