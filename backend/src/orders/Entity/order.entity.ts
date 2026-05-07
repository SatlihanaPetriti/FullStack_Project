import {Entity, PrimaryGeneratedColumn,Column,CreateDateColumn, OneToMany,} from 'typeorm';
import { OrderItem } from './order-item.entity';

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

    @Column({ default: 'completed' })
    status: string;

    @Column()
    payment_stripe_id: string;

    @CreateDateColumn()
    created_at: Date;

    @OneToMany(() => OrderItem, (item) => item.order, { cascade: true })
    items: OrderItem[];
}