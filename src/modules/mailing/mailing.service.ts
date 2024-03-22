import * as nodemailer from "nodemailer";
import * as dotenv from "dotenv";

class MailingService {
  transport: nodemailer.Transporter;
  constructor() {
    dotenv.config();
    this.transport = nodemailer.createTransport(
      {
        host: process.env.MAILING_HOST,
        port: Number(process.env.MAILING_PORT),
        auth: {
          user: process.env.MAILING_EMAIL,
          pass: process.env.MAILING_PASS,
        },
      },
      {
        from: process.env.MAILING_FROM + "<" + process.env.MAILING_EMAIL + ">",
      }
    );
  }

  sendMail(to: string, subject: string, html: string) {
    return this.transport.sendMail({
      to,
      subject,
      html,
    });
  }
}

export default new MailingService() as MailingService;
