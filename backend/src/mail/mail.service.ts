import { Injectable, BadRequestException } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { InjectRepository, } from '@nestjs/typeorm';
import { Repository, } from 'typeorm';
import { Subscriber } from './Entity/subscriber.entity';
import { SendNewsletterDto } from './DTO/send-newsletter.dto';

@Injectable()
export class MailService {

    constructor(
        private mailerService: MailerService,
        @InjectRepository(Subscriber) private subscriberRepository: Repository<Subscriber>,
    ) { }


    public async findAll() {
        try {
            return await this.subscriberRepository.find({
            });
        } catch (error) {
            throw new Error('Error fetching subscribers');
        }
    }

    public async subscribe(email: string) {
        const existing = await this.subscriberRepository.findOne({
            where: { email },
        });
        if (existing) {
            throw new BadRequestException(
                'EMAIL_ALREADY_EXISTS',
            );
        }
        const subscriber = this.subscriberRepository.create({ email });
        await this.subscriberRepository.save(subscriber);
        try {
            await this.sendWelcome(email);
        } catch (error) {
            console.error(`Failed to send welcome email to ${email}:`, error);
        }
        return { message: 'Subscribed successfully', subscriber };
    }

    public async unsubscribe(email: string): Promise<string> {
        const subscriber = await this.subscriberRepository.findOne({
            where: { email },
        });
        if (!subscriber) {
            return `
            <html>
                <body style="font-family:sans-serif; text-align:center; padding:80px; color:#214332;">
                    <h2> Email not found.</h2>
                    <a href="http://localhost:5173">← Back to Green Scene</a>
                </body>
            </html>
        `;
        }

        await this.subscriberRepository.delete({ email });

        return `
        <html>
            <body style="font-family:sans-serif; text-align:center; padding:80px; color:#214332;">
                <h2> Unsubscribed successfully.</h2>
                <p>You will no longer receive emails from us.</p>
                <a href="http://localhost:5173">← Back to Green Scene</a>
            </body>
        </html>
    `;
    }

    public async sendToSubscribers(data: SendNewsletterDto) {
        if (!data.subscriberIds) {
            throw new BadRequestException('subscriberIds is required');
        }
        const subscriberIds = Array.isArray(data.subscriberIds)
            ? data.subscriberIds // [1,2,3]
            : [data.subscriberIds]; // 5 -> [5]
        // merren active subscribers true
        const allSubscribers = await this.subscriberRepository.find({
            where: { isActive: true },
        });
        // filtrojme vetem ata qe zgjidhen nga admin
        const selectedSubscribers = allSubscribers.filter(subscriber =>
            subscriberIds.includes(subscriber.id),
        );
        const emails = selectedSubscribers.map(subscriber => subscriber.email);
        if (!emails.length) {
            throw new BadRequestException('NO_ACTIVE_SUBSCRIBERS');
        }
        // dergojme nje nga nje
        for (const email of emails) {
            await this.mailerService.sendMail({
                to: email,
                subject: data.subject,
                html: `
            <h2>${data.subject}</h2>
            <p>${data.message}</p>
        `,
            });
        }
        return { sentTo: emails.length, emails, message: 'Newsletter sent successfully' };
    }

    public async sendWelcome(subscriberEmail: string) {
        const unsubscribeLink = `http://localhost:3000/mail/unsubscribe?email=${encodeURIComponent(subscriberEmail)}`;
        await this.mailerService.sendMail({
            to: subscriberEmail,
            subject: 'Welcome to ecomus!',
            html: `
            <h2>Thank you for subscribing!</h2>
            <p>We're happy to have you with us. You'll receive our latest news and offers.</p>
            <br/>
            <hr/>
            <p style="font-size: 12px; color: #999;">
                Don't want to receive emails anymore? 
                <a href="${unsubscribeLink}">Unsubscribe here</a>
            </p>
        `,
        });
    }
}