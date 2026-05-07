import { Controller, Get, Param, ParseIntPipe, Req, UseGuards } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { AuthGuard } from '../guards/auth.guards';

@Controller('orders')
@UseGuards(AuthGuard)
export class OrderController {
    constructor(private readonly orderService: OrdersService) { }

    @Get()
    public async getMyOrders(@Req() req: any) {
        return this.orderService.getOrdersByUser(req.user.id);
    }

    @Get(':id')
    public async getOrder(
        @Req() req: any,
        @Param('id', ParseIntPipe) orderId: number,
    ) {
        return this.orderService.getOrderById(req.user.id, orderId);
    }
}