import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { OrderItem } from './order-items';

@Entity('orders')
export class Order {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    user_id: number;

    @Column()
    quantity: number;

    @Column()
    total: number;

    @OneToMany(() => OrderItem, (item) => item.order)
    items: OrderItem[];
}