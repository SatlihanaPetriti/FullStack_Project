import { Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MailService } from './mail.service';
import { MailController } from './mail.controller';
import { Subscriber } from './Entity/subscriber.entity';

@Module({
    imports: [

        TypeOrmModule.forFeature([
            Subscriber,
        ]),

        MailerModule.forRoot({
            transport: {
                host: 'smtp.gmail.com',
                port: 587,
                secure: false,
                tls: {
                    rejectUnauthorized: false,
                },

                auth: {
                    user: import.meta.env.EMAIL_USER,
                    pass: import.meta.env.EMAIL_PASS,
                },
            },

            defaults: {
                from: `"Green Scene" <${import.meta.env.EMAIL_USER}>`,
            },
        }),
    ],

    providers: [
        MailService,
    ],

    controllers: [
        MailController,
    ],
})
export class MailModule { }