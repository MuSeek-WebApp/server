/* eslint-disable prettier/prettier */
import nodemailer from 'nodemailer';
import fs from 'fs';
import handlebars from 'handlebars';
import logger from '../utils/logger';

class MailSrv {
  constructor() {
    //gmailpass - AmirAdler1234
    this.transporter = nodemailer.createTransport({
      service: 'DebugMail',
      auth: {
        user: 'museekproj@gmail.com',
        pass: 'e1a43380-af2b-11e9-a134-47b869223e56'
      }
    });
  }

  async sendMail(email, requestUserName, userName, eventName, status) {
    logger.info('creating mail html in path ' + `${__dirname}\\template.html`);
    fs.readFile(
      `${__dirname}\\template.html`,
      {
        encoding: 'utf-8'
      },
      (err, html) => {
        const template = handlebars.compile(html);
        const replacements = {
          requestUserName,
          userName,
          eventName,
          status
        };
        const htmlToSend = template(replacements);

        const mailOptions = {
          from: 'museekproj@gmail.com',
          to: email,
          subject: `Request status of ${requestUserName} has changed to ${status}`,
          html: htmlToSend
        };

        this.transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
            logger.error(error);
          } else {
            logger.info(`Email sent: ${info.response}`);
          }
        });
      }
    );
  }
}

export default new MailSrv();
