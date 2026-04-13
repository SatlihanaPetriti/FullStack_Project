import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Cart } from './Cart';
import { Product } from '../../products/Entity/product.entity'

@Entity('cart_items')
export class CartItem {
    @PrimaryGeneratedColumn()
    id:number;
    
    @Column()
    cart_id:number;

    @Column()
    product_id:number;
    
    @Column({ default: 1 })
    quantity: number;

    @ManyToOne(() => Cart, (cart) => cart.items, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'cart_id' })
    cart: Cart;

    @ManyToOne(() => Product, (product) => product.cartItems, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'product_id' })
    product: Product;

}