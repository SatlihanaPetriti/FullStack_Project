import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm/dist/common/typeorm.decorators';
import { Order } from './Entity/order.entity';
import { Repository } from 'typeorm';

@Injectable()
export class OrdersService {
    constructor(
        @InjectRepository(Order) private orderRepo: Repository<Order>,
    ) { }

    public async getOrdersByUser(userId: number): Promise<Order[]> {
        return this.orderRepo.find({
            where: { user_id: userId },
            relations: ['items'],
        });
    }

    public async getOrderById(userId: number, orderId: number): Promise<Order> {
        const order = await this.orderRepo.findOne({
            where: { id: orderId, user_id: userId },
            relations: ['items'],
        });

        if (!order) {
            throw new NotFoundException('Order not found');
        }

        return order;
    }
}