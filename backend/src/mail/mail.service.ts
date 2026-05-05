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
        await this.sendWelcome(email);
        return {
            message: 'Subscribed successfully',
        };
    }
    public async unsubscribe(email: string) {
        const subscriber = await this.subscriberRepository.findOne({
            where: { email },
        });

        if (!subscriber) {
            throw new BadRequestException('EMAIL_NOT_FOUND');
        }
        if (!subscriber.isActive) {
            throw new BadRequestException('ALREADY_UNSUBSCRIBED');
        }
        await this.subscriberRepository.update(
            { email },
            { isActive: false }
        );

        return { message: 'Unsubscribed successfully' };
    }


    public async sendToSubscribers(data: SendNewsletterDto) {
        if (!data.subscriberIds) {
            throw new BadRequestException('subscriberIds is required');
        }
        const subscriberIds = Array.isArray(data.subscriberIds)
            ? data.subscriberIds
            : [data.subscriberIds];
            
        const allSubscribers = await this.subscriberRepository.find({
            where: { isActive: true },
        });
        const selectedSubscribers = allSubscribers.filter(subscriber =>
            subscriberIds.includes(subscriber.id),
        );

        const emails = selectedSubscribers.map(subscriber => subscriber.email);
        if (!emails.length) {
            throw new BadRequestException('NO_ACTIVE_SUBSCRIBERS');
        }
        await this.mailerService.sendMail({
            to: emails,
            subject: data.subject,
            html: `
            <h2>${data.subject}</h2>
            <p>${data.message}</p>
        `,
        });

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