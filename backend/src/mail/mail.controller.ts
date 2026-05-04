import {Controller,Post,Get,Body,Query,BadRequestException,
} from '@nestjs/common';

import { MailService } from './mail.service';

@Controller('mail')
export class MailController {
    constructor(private mailService: MailService) { }

    @Post('subscribe')
    public async subscribe(@Body('email') email: string) {
        if (!email || !email.includes('@')) {
            throw new BadRequestException('INVALID_EMAIL');
        }
        return this.mailService.subscribe(email);
    }

    @Get('unsubscribe')
    public async unsubscribeFromLink(@Query('email') email: string) {
        if (!email || !email.includes('@')) {
            throw new BadRequestException('INVALID_EMAIL');
        }
        return this.mailService.unsubscribe(email);
    }

    @Get('subscribers')
    public async getSubscribers() {
        return this.mailService.getSubscribers();
    }
}