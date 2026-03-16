import { Entity, Column, PrimaryColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Product } from './product.entity';

@Entity('product_variants')
export class ProductVariant {
    @PrimaryColumn()
    id: string;

    @Column()
    type: string;

    @Column('int')
    stock: number;

    @ManyToOne(() => Product, product => product.variants, {
        onDelete: 'CASCADE',
    })
    @JoinColumn({ name: 'productId' })
    product: Product;

    @Column({ name: 'productId' })
    productId: string;

    @Column()
    image: string;
}
//JoinColumn its written always to one side to the owning side(ManyToOne)

///Product:

// I have many variants → OneToMany

// ProductVariant:

// I belong to one product → ManyToOne