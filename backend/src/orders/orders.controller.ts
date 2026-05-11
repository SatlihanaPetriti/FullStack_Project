import { Controller, Get, Param, ParseIntPipe, Put, Req, UseGuards, Body } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { AuthGuard } from '../guards/auth.guards';
import { UpdateOrderStatusDto } from './DTO/order-status.dto';
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
    
    @Put(':id/status')
    public async updateStatus(
        @Param('id', ParseIntPipe) orderId: number,
        @Body('status') dto: UpdateOrderStatusDto,
    ) {
        return this.orderService.updateOrderStatus(orderId, dto);
    }
}