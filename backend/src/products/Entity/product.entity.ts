import { Entity, Column, PrimaryGeneratedColumn, OneToMany, ManyToOne, JoinColumn } from 'typeorm';
import { ProductVariant } from './product-variant.entity';
import { CategoryEntity } from '../../Category/Entity/CategoryEntity';

@Entity('products')
export class Product {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => CategoryEntity, category => category.products)
    @JoinColumn({ name: 'category_id' })
    category: CategoryEntity;

    @Column()
    category_id: number;

    @Column()
    title: string;

    @Column({ nullable: true })
    label: string;

    @Column()
    size: string;

    @Column('decimal', { precision: 10, scale: 2 })
    price: number;

    @Column('decimal', { precision: 10, scale: 2, nullable: true })
    sale_price: number;

    @Column('int', { nullable: true })
    sale_percentage: number;

    @Column({ default: false })
    is_bundle: boolean;

    @Column({ type: 'date', nullable: true })
    date_added: Date;

    @OneToMany(() => ProductVariant, variant => variant.product)
    variants: ProductVariant[];
}