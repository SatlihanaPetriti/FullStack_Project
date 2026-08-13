import { Module } from '@nestjs/common';
import { SendEmailController } from './send_email.controller';
import { SendEmailService } from './send_email.service';
import { MailerModule } from '@nestjs-modules/mailer';

@Module({
  imports: [
    MailerModule.forRoot({
      transport: {
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
          user: import.meta.env.EMAIL_USER,
          pass: import.meta.env.EMAIL_PASS
        }
      }
    })
  ],
  controllers: [SendEmailController],
  providers: [SendEmailService],
})
export class SendEmailModule { }
