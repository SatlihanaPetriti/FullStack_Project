import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, } from 'typeorm';
import { Cart } from './cart';
import { Product } from 'src/products/Entity/product.entity';

@Entity('cart_items')
export class CartItem {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    cart_id: number;

    @ManyToOne(() => Cart, cart => cart.items)
    @JoinColumn({ name: 'cart_id' })
    cart: Cart;

    @Column()
    product_id: number;

    @Column()
    quantity: number;

    @Column({
        type: 'decimal', transformer: {
            to: (value: number) => value,
            from: (value: string) => Number(value),
        }
    })
    price: number;

    @ManyToOne(() => Product)
    @JoinColumn({ name: 'product_id' })
    product: Product;
}