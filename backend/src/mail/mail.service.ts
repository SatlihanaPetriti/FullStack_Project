import { Injectable, BadRequestException } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { InjectRepository, } from '@nestjs/typeorm';
import { Repository, } from 'typeorm';
import { Subscriber } from './Entity/subscriber.entity';

@Injectable()
export class MailService {

    constructor(
        private mailerService: MailerService,
        @InjectRepository(Subscriber) private subscriberRepository: Repository<Subscriber>,
    ) { }

    public async getSubscribers() {
        return this.subscriberRepository.find({
            order: { createdAt: 'DESC' },
        });
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