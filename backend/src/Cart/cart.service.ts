import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cart } from './Entity/cart';
import { CartItem } from './Entity/cart-items';
import { Product } from 'src/products/Entity/product.entity';

@Injectable()
export class CartService {
    constructor(
        @InjectRepository(Cart) private cartRepo: Repository<Cart>,
        @InjectRepository(CartItem) private cartItemRepo: Repository<CartItem>,
        @InjectRepository(Product) private productRepo: Repository<Product>,
    ) { }

    public async getCart(user_id: number): Promise<Cart> {
        const cart = await this.cartRepo.findOne({
            where: { user_id },
            relations: ['items'],
        });
        if (!cart) {
            throw new NotFoundException('No cart found');
        }
        return cart;
    }

    // shto ne cart
    public async addToCart(
        user_id: number,
        items: { product_id: number; quantity: number }[],
    ): Promise<CartItem[]> {

        let cart = await this.cartRepo.findOne({ where: { user_id } });

        if (!cart) {
            cart = await this.cartRepo.save({ user_id });
        }

        const savedItems = await Promise.all(
            items.map(async ({ product_id, quantity }) => {

                const product = await this.productRepo.findOne({
                    where: { id: product_id },
                });

                if (!product) {
                    throw new NotFoundException(`Product with id ${product_id} not found`);
                }

                if (quantity <= 0) {
                    throw new BadRequestException(`Quantity must be greater than 0`);
                }

                const existing = await this.cartItemRepo.findOne({
                    where: { cart_id: cart.id, product_id },
                });

                if (existing) {
                    const newQuantity = existing.quantity + quantity;

                    if (product.stock < newQuantity) {
                        throw new BadRequestException(`Not enough stock. Available: ${product.stock}`);
                    }

                    existing.quantity = newQuantity;
                    return await this.cartItemRepo.save(existing);
                }

                const cartItem = this.cartItemRepo.create({
                    cart_id: cart.id,
                    product_id,
                    quantity,
                    price: product.price,
                });

                return await this.cartItemRepo.save(cartItem);
            }),
        );
        const allItems = await this.cartItemRepo.find({
            where: { cart_id: cart.id },
        });
        const total_quantity = allItems.reduce(
            (sum, i) => sum + i.quantity,
            0,
        );

        const total_price = allItems.reduce(
            (sum, i) => sum + i.quantity * Number(i.price),
            0,
        );

        await this.cartRepo.update(cart.id, {
            total_quantity,
            total_price,
        });

        return savedItems;
    }


    public async updateQuantity(
        userId: number,
        cartItemId: number,
        quantity: number,
    ): Promise<{ id: number; quantity: number }> {

        const item = await this.cartItemRepo.findOne({
            where: { id: cartItemId },
            relations: ['cart', 'product'],
        });

        if (!item || item.cart.user_id !== userId) {
            throw new NotFoundException('Cart item not found');
        }

        if (quantity <= 0) {
            throw new BadRequestException('Quantity must be greater than 0');
        }

        if (item.product.stock < quantity) {
            throw new BadRequestException(
                `Not enough stock. Available: ${item.product.stock}`,
            );
        }

        item.quantity = quantity;
        await this.cartItemRepo.save(item);
        console.log('-----quantity updated:', item.quantity);
        const allItems = await this.cartItemRepo.find({
            where: { cart_id: item.cart.id },
        });

        const total_quantity = allItems.reduce(
            (sum, i) => sum + i.quantity,
            0,
        );

        const total_price = allItems.reduce(
            (sum, i) => sum + i.quantity * Number(i.price),
            0,
        );
        console.log('total quantity:', total_quantity);
        console.log('total price:', total_price);
        await this.cartRepo.update(item.cart.id, {
            total_quantity,
            total_price,
        });

        return {
            id: item.id,
            quantity: item.quantity,

        };
    }




    public async removeFromCart(
        userId: number,
        cartItemId: number,
    ): Promise<{ message: string }> {

        const item = await this.cartItemRepo.findOne({
            where: { id: cartItemId },
            relations: ['cart'],
        });

        if (!item || item.cart.user_id !== userId) {
            throw new NotFoundException('Cart item not found');
        }

        const cartId = item.cart.id;

        // 1. delete item
        await this.cartItemRepo.remove(item);

        // 2. get remaining items
        const remainingItems = await this.cartItemRepo.find({
            where: { cart_id: cartId },
        });

        // 3. recalc totals
        const total_quantity = remainingItems.reduce(
            (sum, i) => sum + i.quantity,
            0,
        );

        const total_price = remainingItems.reduce(
            (sum, i) => sum + i.quantity * Number(i.price),
            0,
        );

        // 4. update cart
        await this.cartRepo.update(cartId, {
            total_quantity,
            total_price,
        });

        return { message: 'Item removed from cart' };
    }




    public async clearCart(userId: number) {
        const cart = await this.cartRepo.findOne({
            where: { user_id: userId },
        });

        if (!cart) {
            throw new NotFoundException('Cart not found');
        }
        await this.cartItemRepo.delete({ cart_id: cart.id });
        await this.cartRepo.remove(cart);
        return {
            message: 'Cart cleared successfully',
            user_id: userId,
        };
    }
}

