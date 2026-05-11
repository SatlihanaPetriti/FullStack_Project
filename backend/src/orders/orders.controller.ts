import { Controller, Get, Param, ParseIntPipe, Put, Req, UseGuards, Body } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { AuthGuard } from '../guards/auth.guards';
import { PermissionGuard } from '../guards/permission.guards';
import { Roles } from '../decorators/roles.decorator';
import { UpdateOrderStatusDto } from './DTO/order-status.dto';

@Controller('orders')
@UseGuards(AuthGuard, PermissionGuard)
export class OrderController {
    constructor(private readonly orderService: OrdersService) { }

    @Get()
    getMyOrders(@Req() req: any) {
        return this.orderService.getOrdersByUser(req.user.id);
    }

    @Get('all')
    @Roles('admin')
    getAllOrders() {
        return this.orderService.getAllOrders();
    }

    @Get(':id')
    getOrder(
        @Req() req: any,
        @Param('id', ParseIntPipe) orderId: number,
    ) {
        return this.orderService.getOrderById(req.user.id, orderId);
    }

    @Put(':id/status')
    @Roles('admin')
    updateStatus(
        @Param('id', ParseIntPipe) orderId: number,
        @Body() dto: UpdateOrderStatusDto,
    ) {
        return this.orderService.updateOrderStatus(orderId, dto);
    }
}