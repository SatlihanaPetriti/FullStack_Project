import { Entity, Column, PrimaryColumn, OneToMany } from 'typeorm';
import { ProductVariant } from './product-variant.entity';

@Entity('products')
export class Product {
    @PrimaryColumn()
    id: string;

    @Column()
    title: string;

    @Column({ nullable: true })
    label: string;

    @Column()
    category: string;

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
    //if add and update nje produkt with variants, will autosave. 
    // 'remove' not necessary cuz we have cascadian ne productvariant
    @OneToMany(() => ProductVariant, variant => variant.product, { //Product → has many → ProductVariant
        cascade: ['insert', 'update'],
        eager: true,// auto-load everytime happens a action(remove,delete,edit)(variants)
    })
    variants: ProductVariant[];
}

//OneToMany perdoret kur rows belong to one product(nuk krijo column its for navigation).
//disa variants-> 1 product
//OneToMany navigation


// ManyToOne = child → parent → use @JoinColumn

// OneToMany = parent → children → do NOT use @JoinColumn

