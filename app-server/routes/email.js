`use strict`;

const nodemailer = require(`nodemailer`);
const jwt = require(`jsonwebtoken`);
const express = require(`express`);
const { winston } = require(`../logging`);

const router = express.Router();

const _15_MINUTES = `15m`;

router.route(`/contactUs`)
  .post(async (request, response, next) => {
    try {
      const transport = {
        service: `Gmail`,
        auth: {
          user: process.env.EMAIL,
          pass: process.env.EMAIL_PASSWORD
        }
      };

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

      winston.debug(`configuring email options ${JSON.stringify(mail)}`);

      const result = await transporter.sendMail(mail);

      if (result.accepted.length === 1 && result.rejected.length === 0) {
        winston.info(`(contactUs) email successfully sent from ${email}`);
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

router.route(`/forgotPassword`)
  .post(async (request, response, next) => {
    try {
      const { email } = request.body;
      const { UsersCollection } = request.app.locals;
      const user = await UsersCollection.findOne({ email });

      if (!user) {
        return response.status(400).send(`User does not exist`);
      }

      const transport = {
        service: `Gmail`,
        auth: {
          user: process.env.EMAIL,
          pass: process.env.EMAIL_PASSWORD
        }
      };

      const transporter = nodemailer.createTransport(transport);
      const ready = await transporter.verify();

      if (!ready) {
        winston.error(`mail transporter not ready, aborting`);
        return response.status(503).send(`Error: Your password cannot be reset at this time. Please try again later.`);
      }

      const { PasswordResetsCollection } = request.app.locals;

      const token = jwt.sign({ data: { email: user.email, userID: user._id } }, process.env.TOKEN_SECRET, { expiresIn: _15_MINUTES });

      const document = {
        email,
        token,
        used: false
      };

      await PasswordResetsCollection.insertOne(document);

      const mail = {
        to: email,
        subject: `Reset Password`,
        text: `Please visit this link to reset your password: ${process.env.APP_HOST}/resetPassword/${token}`
      };

      winston.debug(`configuring email options ${JSON.stringify(mail)}`);

      const result = await transporter.sendMail(mail);

      if (result.accepted.length === 1 && result.rejected.length === 0) {
        winston.info(`(forgotPassword) email successfully sent to ${email}`);
        return response.status(202).send(`Please check your email for a link to reset your password.`);
      }
      else {
        winston.error(`message could not be sent; email attempt was not accepted (was rejected)`);
        return response.status(400).send(`Error: Your password cannot be reset at this time. Please try again later.`);
      }
    }
    catch (error) {
      return next(error);
    }
  })

module.exports = router;
