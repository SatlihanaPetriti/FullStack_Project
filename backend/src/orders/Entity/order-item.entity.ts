import {Entity,PrimaryGeneratedColumn,Column,ManyToOne,JoinColumn,} from 'typeorm';
import { Order } from './order.entity';

@Entity('order_items')
export class OrderItem {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    order_id: number;

    @ManyToOne(() => Order, (order) => order.items)
    @JoinColumn({ name: 'order_id' })
    order: Order;

    @Column()
    product_id: number;

    @Column()
    product_title: string;

    @Column()
    quantity: number;

    @Column({
        type: 'decimal',
        transformer: {
            to: (value: number) => value,
            from: (value: string) => Number(value),
        },
    })
    price: number;
}