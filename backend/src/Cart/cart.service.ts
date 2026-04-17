import { Injectable, NotFoundException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ErrorHandler } from '../ErrorHandler/ErrorHandler';
import { Repository } from 'typeorm';
import { order_items } from './Entity/order';
import { Product } from '../products/Entity/product.entity';

@Injectable()
export class CartService {
    constructor(
        @InjectRepository(CartItem) private readonly cartRepository: Repository<CartItem>,
        @InjectRepository(Product) private readonly productRepository: Repository<Product>,
    ) { }


    // shfaq cartin e userit
    public async getCart(userId: number): Promise<CartItem[]> {
        return await this.cartRepository.find({
            where: { user_id: userId },
            relations: ['product'],
        });
    }

    // shto ne cart
    public async addToCart(userId: number, dto: AddToCartDto): Promise<CartItem> {
        const product = await this.productRepository.findOne({
            where: { id: dto.productId },
        });
        if (!product) {
            throw new ErrorHandler('Product not found', HttpStatus.NOT_FOUND);
        }
        //kontrollohet sasia me stock 
        if (product.stock < dto.quantity) {
            throw new ErrorHandler(
                `Not enough stock. Available: ${product.stock}`,
                HttpStatus.BAD_REQUEST,
            );
        }
        //kontrollohet nese useri e ka produktin ne cart,
        const existingItem = await this.cartRepository.findOne({
            where: { user_id: userId, product_id: dto.productId },
        });

        if (existingItem) {
            //  Produkt ekziston -shto sasine
            const newQuantity = existingItem.quantity + dto.quantity;
            //kontrollohet stock pas shtimit te sasise
            if (product.stock < newQuantity) {
                throw new ErrorHandler(
                    `Not enough stock. Available: ${product.stock}`,
                    HttpStatus.BAD_REQUEST,
                );
            }
            // behet llogaritja e quantity ne db me request
            existingItem.quantity = newQuantity;
            return await this.cartRepository.save(existingItem);
        }
        // nese item nuk ekziston create
        const newItem = this.cartRepository.create({
            user_id: userId,
            product_id: dto.productId,
            quantity: dto.quantity,
        });

        return await this.cartRepository.save(newItem);
    }



    public async removeFromCart(userId: number, cartItemId: number): Promise<{ message: string }> {
        const item = await this.cartRepository.findOne({
            where: { id: cartItemId, user_id: userId },
        });

        if (!item) {
            throw new ErrorHandler('Cart item not found', HttpStatus.NOT_FOUND);
        }

        await this.cartRepository.remove(item);
        return { message: 'Item removed from cart' };
    }


    public async updateQuantity(userId: number, cartItemId: number, quantity: number): Promise<CartItem> {
        const item = await this.cartRepository.findOne({
            where: { id: cartItemId, user_id: userId },
            relations: ['product'],
        });

        if (!item) {
            throw new ErrorHandler('Cart item not found', HttpStatus.NOT_FOUND);
        }
        // kontrollohet nese quantity e kerkuar eshte me e madhe se stock
        if (item.product.stock < quantity) {
            throw new ErrorHandler(
                `Not enough stock. Available: ${item.product.stock}`,
                HttpStatus.BAD_REQUEST,
            );
        }
        // perditeson sasine e produktit ne cart sasine aktuale ne db me vleren e re nga request
        item.quantity = quantity;
        return await this.cartRepository.save(item);
    }

    public async clearCart(userId: number): Promise<{ message: string }> {
        await this.cartRepository.delete({ user_id: userId });
        return { message: 'Cart cleared' };
    }
}

