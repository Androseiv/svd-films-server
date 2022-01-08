const nodemailer = require('nodemailer')

class MailService {
  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD
      }
    })
  }

  async sendActivationMail(to, link) {
    await this.transporter.sendMail({
      from: process.env.SMTP_USER,
      to,
      subject: 'Account Activation 👻',
      text: '',
      html:
        `
          <div style="text-align: center">
            <h1>Hello from ${process.env.PROJECT_NAME}! For the account activation click on the link below</h1>
            <a href="${link}">Click Here!</a>
          </div>
        `
    })
  }
}

module.exports = new MailService();