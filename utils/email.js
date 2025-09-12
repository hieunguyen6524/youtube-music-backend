const nodemailer = require('nodemailer');
const fs = require('fs');
const htmlToText = require('html-to-text');

class Email {
  constructor(user, url) {
    this.to = user.email;
    this.name = user.name;
    this.url = url;
    this.from = `Youtube <${process.env.EMAIL_ADDRESS}>`;
  }

  newTransport() {
    return nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_ADDRESS,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
  }

  async send(template, subject) {
    const html = fs
      .readFileSync(`${__dirname}/public/templates/${template}.html`, 'utf-8')
      .replace('{{name}}', this.name)
      .replace('{{tokenUrl}}', this.url)
      .replace('{{subject}}', subject)
      .replace('{{year}}', new Date().getFullYear());

    const mailOption = {
      from: this.from,
      to: this.to,
      subject,
      html,
      text: htmlToText.convert(html),
    };

    await this.newTransport().sendMail(mailOption);
  }

  async sendEmailVerify() {
    await this.send(
      'EmailVerification',
      'Cảm ơn bạn đã đăng ký tài khoản YouTube. Hãy xác nhận email của bạn ngay để kích hoạt tài khoản và thế là bạn sẽ sẵn sàng.'
    );
  }

  async sendResetPassword() {
    await this.send(
      'ForgotPassword',
      'Vui long nhấn vào nút bên dưới để có thể đặt lại mật khẩu mới'
    );
  }
}

module.exports = Email;
