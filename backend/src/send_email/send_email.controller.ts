import { Controller, Post, Body } from '@nestjs/common';
import { SendEmailService } from './send_email.service';

@Controller('send-email')
export class SendEmailController {
    constructor(private readonly sendEmailService: SendEmailService) { }

    @Post('contact')
    public async sendContactEmail(@Body() data: any) {
        return this.sendEmailService.sendEmail(data);
    }
}