import { IsEnum } from 'class-validator';
import { OrderStatus } from '../Entity/order.entity';

export class UpdateOrderStatusDto {
    @IsEnum(OrderStatus)
    status: OrderStatus;
}
