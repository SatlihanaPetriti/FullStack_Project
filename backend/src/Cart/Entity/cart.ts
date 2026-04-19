import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { CartItem } from './cart-items';

@Entity('cart')
export class Cart {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    user_id: number;

    @Column({ default: 0 })
    total_quantity: number;

    @Column({
        type: 'decimal', default: 0, transformer: {
            to: (value: number) => value,
            from: (value: string) => Number(value),
        }
    })
    total_price: number;

    @OneToMany(() => CartItem, item => item.cart)
    items: CartItem[];
}