import { Controller, Post, Body, BadRequestException } from '@nestjs/common';
import { MailService } from './mail.service';

@Controller('mail')
export class MailController {
    constructor(private mailService: MailService) { }

    @Post('subscribe')
    async subscribe(@Body('email') email: string) {
        if (!email || !email.includes('@')) {
            throw new BadRequestException('INVALID_EMAIL');
        }

        await this.mailService.sendWelcome(email);
        return { message: 'The email was sent successfully!' };
    }
}