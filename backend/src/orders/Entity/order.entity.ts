import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany, } from 'typeorm';
import { OrderItem } from './order-item.entity';

export enum OrderStatus {
    PENDING = 'pending',
    PROCESSING = 'processing',
    SHIPPED = 'shipped',
    DELIVERED = 'delivered',
    COMPLETED = 'completed',
}

@Entity('orders')
export class Order {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    user_id: number;

    @Column({
        type: 'decimal',
        transformer: {
            to: (value: number) => value,
            from: (value: string) => Number(value),
        },
    })
    total_price: number;

    @Column({
        type: 'enum',
        enum: OrderStatus,
        default: OrderStatus.PENDING,
    })
    status: OrderStatus;

    @Column()
    payment_stripe_id: string;

    @CreateDateColumn()
    created_at: Date;

    @OneToMany(() => OrderItem, (item) => item.order, { cascade: true })
    items: OrderItem[];
}