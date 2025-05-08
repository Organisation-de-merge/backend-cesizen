import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

const URL = process.env.URL;

@Injectable()
export class MailService {
  private transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com', 
    port: 587,
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  async sendResetCode(email: string, code: string) {
    await this.transporter.sendMail({
      from: '"CesiZen" <no-reply@cesizen.fr>',
      to: email,
      subject: 'Votre code de réinitialisation',
      html: `
        <p>Voici votre code de réinitialisation :</p>
        <h2 style="font-size: 24px;">${code}</h2>
        <p>Ce code expirera dans 15 minutes.</p>
      `,
    });
  }
}