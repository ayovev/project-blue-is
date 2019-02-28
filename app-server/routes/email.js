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
      const { email, subject, message } = request.body;
      const content = `email: ${email} \n subject: ${subject} \n message: ${message} `;

      const mail = {
        from: `IEEN`,
        to: process.env.EMAIL,
        subject: `New Message from Contact Form | ${subject}`,
        text: content
      };

      const result = await transporter.sendMail(mail);

      // fail case?

      console.log(result);

      // TODO @Nate: modify this to use some good, specific verbiage
      response.status(202).send(`Email successfully sent`);
    }
    // fail case?
  });

module.exports = router;
