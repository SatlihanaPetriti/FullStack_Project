
import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class MailService {
    constructor(private mailerService: MailerService) { }

    async sendWelcome(subscriberEmail: string) {
        await this.mailerService.sendMail({
            to: subscriberEmail,
            subject: 'Welcome to ecomus!',
            html: `
          <h2 style="color: #2d6a4f;">Thank you for subscribing!</h2>
        </div>`,
        });
    }
}