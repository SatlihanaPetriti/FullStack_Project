import {
    Controller, Post, Get, Body, Query, BadRequestException,
    Res,
    Header,
} from '@nestjs/common';

import { MailService } from './mail.service';
import { SendNewsletterDto } from './DTO/send-newsletter.dto';

@Controller('mail')
export class MailController {
    constructor(private mailService: MailService) { }
    
    @Get('subscribers')
    public async getSubscribers() {
        return this.mailService.findAll();
    }
    
    @Post('subscribe')
    public async subscribe(@Body('email') email: string) {
        if (!email || !email.includes('@')) {
            throw new BadRequestException('INVALID_EMAIL');
        }
        return this.mailService.subscribe(email);
    }

    @Get('unsubscribe')
    @Header('Content-Type', 'text/html')
    public async unsubscribeFromLink(@Query('email') email: string) {
        if (!email || !email.includes('@')) {
            throw new BadRequestException('INVALID_EMAIL');
        }
        return this.mailService.unsubscribe(email);
    }
    
    @Post('send-newsletter')
    public async sendNewsletter(@Body() body: SendNewsletterDto,) {
        return this.mailService.sendToSubscribers(body);
    }

   
}