import {Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn,} from 'typeorm';

import { Product } from '../../products/Entity/product.entity';


@Entity('favorites')
export class Favorite {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    user_id: number;

    @Column()
    product_id: number;

    @ManyToOne(() => Product, (product) => product.favorites, {onDelete: 'CASCADE',})
    @JoinColumn({ name: 'product_id' })
    product: Product;
}