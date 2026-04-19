import { Controller, Post, Req, UseGuards, Body } from '@nestjs/common';
import { CheckoutService } from './checkout.service';
import { AuthGuard } from '../guards/auth.guards';

@Controller('checkout')
@UseGuards(AuthGuard)
export class CheckoutController {
    constructor(private readonly checkoutService: CheckoutService) { }

    @Post('create-intent')
    async createIntent(@Req() req: any) {
        return await this.checkoutService.createPaymentIntent(req.user.id);
    }

    @Post('confirm')
    async confirm(
        @Req() req: any,
        @Body('paymentIntentId') paymentIntentId: string,
    ) {
        return await this.checkoutService.confirmOrder(req.user.id, paymentIntentId);
    }
}