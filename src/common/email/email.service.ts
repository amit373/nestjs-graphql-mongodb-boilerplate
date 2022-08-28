import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createTransport } from 'nodemailer';

import { emailVerifyTemplate } from './email.template';

interface IOptions {
    to: string;
    subject?: string;
    text?: string;
    html?: string;
}

@Injectable()
export class EmailService {
    constructor(private readonly configService: ConfigService) {}

    async sendEmail(
        options: IOptions,
        data: { opt: string; minutes: number; brand: string }
    ): Promise<boolean> {
        const {
            host,
            port,
            service,
            email: user,
            password: pass,
            fromName,
            fromEmail,
        } = this.configService.get('email');

        const transporter = createTransport({
            host,
            port,
            secure: false,
            service,
            auth: { user, pass },
        });

        const { to, subject, text, html } = options;

        const emailData = emailVerifyTemplate(
            data?.opt,
            data?.minutes,
            data?.brand
        );

        const message = {
            from: `${fromName} <${fromEmail}>`,
            to,
            subject: subject ? subject : emailData.subject,
            text: text ? text : emailData.text,
            html: html ? html : emailData.html,
        };

        try {
            const info = await transporter.sendMail(message);
            console.log(`Email sent: ${info?.messageId}`);
            return true;
        } catch (error) {
            console.log(
                `[Mail Error] [${error?.code}] [${error?.responseCode}] ${error?.response}`
            );
            return null;
        }
    }
}
