import { Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { MailService } from './mail.service';
import { MailController } from './mail.controller';

@Module({
    imports: [
        MailerModule.forRoot({
            transport: {
                host: 'smtp.gmail.com',
                port: 587,
                secure: false,
                tls: {
                    rejectUnauthorized: false 
                },
                auth: {
                    user: process.env.EMAIL_USER,  
                    pass: process.env.EMAIL_PASS,   
                },
            },
            defaults: {
                from: '"Green Scene" <youremail@gmail.com>',
            },
        }),
    ],
    providers: [MailService],
    controllers: [MailController],
})
export class MailModule { }