import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, Unique, JoinColumn } from 'typeorm';
import { Product } from '../../products/Entity/product.entity';

@Entity('favorites')
@Unique(['user_id', 'product_id'])
export class Favorite {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    user_id: number;

    @Column()
    product_id: number;

    @ManyToOne(() => Product, product => product.favorites, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'product_qsfsid' })
    product: Product;

}