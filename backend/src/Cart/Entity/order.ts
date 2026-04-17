import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { OrderItem } from './order-items';

@Entity('order_items')
export class Order {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    user_id: number;

    @Column()
    quantity: number;

    @Column()
    total: number;

    @OneToMany(() => OrderItem, (item) => item.order, { cascade: true, })
    items: OrderItem[];
}