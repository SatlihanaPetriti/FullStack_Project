import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Product } from '../../products/Entity/product.entity';

@Entity('categories')
export class CategoryEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @OneToMany(() => Product, product => product.category)
    products: Product[];

    @Column()
    name: string;

    @Column({ nullable: true })
    image_url: string;
}