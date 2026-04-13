import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cart } from './Entity/Cart';
import { CartItem } from './Entity/CartItem';

@Injectable()
export class CartService {
    constructor(
        @InjectRepository(Cart) private readonly cartRepo: Repository<Cart>,
        @InjectRepository(CartItem) private readonly cartItemRepo: Repository<CartItem>,
    ) { }

    // Merr ose krijo cart per userin
    private async getOrCreateCart(user_id: number): Promise<Cart> {
        let cart = await this.cartRepo.findOne({ where: { user_id } });
        if (!cart) {
            cart = this.cartRepo.create({ user_id });
            await this.cartRepo.save(cart);
        }
        return cart;
    }

    // Shiko cart-in me te gjitha produktet
    public async getCart(user_id: number): Promise<Cart> {
        const cart = await this.cartRepo.findOne({
            where: { user_id },
            relations: ['items', 'items.product', 'items.product.variants', 'items.product.category'],
        });

        if (!cart) {
            // Nese nuk ka cart, kthe nje cart bosh
            return this.getOrCreateCart(user_id);
        }

        return cart;
    }

    // Shto produkt ne cart
    public async addToCart(user_id: number, product_id: number, quantity: number = 1): Promise<Cart> {
        const cart = await this.getOrCreateCart(user_id);

        // Kontrollo nese produkti ekziston ne cart
        const existingItem = await this.cartItemRepo.findOne({
            where: { cart_id: cart.id, product_id },
        });

        if (existingItem) {
            // Nese ekziston, shto quantity
            existingItem.quantity += quantity;
            await this.cartItemRepo.save(existingItem);
        } else {
            // Nese nuk ekziston, krijo item te ri
            const newItem = this.cartItemRepo.create({
                cart_id: cart.id,
                product_id,
                quantity,
            });
            await this.cartItemRepo.save(newItem);
        }

        return this.getCart(user_id);
    }

    // Ndrysho quantity
    public async updateQuantity(user_id: number, product_id: number, quantity: number): Promise<Cart> {
        const cart = await this.cartRepo.findOne({ where: { user_id } });
        if (!cart) throw new NotFoundException('Cart not found');

        const item = await this.cartItemRepo.findOne({
            where: { cart_id: cart.id, product_id },
        });
        if (!item) throw new NotFoundException('Product not found in cart');

        if (quantity <= 0) {
            // Nese quantity eshte 0 ose me pak, fshij produktin
            await this.cartItemRepo.delete(item.id);
        } else {
            item.quantity = quantity;
            await this.cartItemRepo.save(item);
        }

        return this.getCart(user_id);
    }

    // Hiq produkt nga cart
    public async removeFromCart(user_id: number, product_id: number): Promise<Cart> {
        const cart = await this.cartRepo.findOne({ where: { user_id } });
        if (!cart) throw new NotFoundException('Cart not found');

        const item = await this.cartItemRepo.findOne({
            where: { cart_id: cart.id, product_id },
        });
        if (!item) throw new NotFoundException('Product not found in cart');

        await this.cartItemRepo.remove(item);
        return this.getCart(user_id);
    }

    // Fshij te gjithe cart-in (perdoret pas checkout)
    public async clearCart(user_id: number): Promise<void> {
        const cart = await this.cartRepo.findOne({ where: { user_id } });
        if (!cart) return;
        await this.cartItemRepo.delete({ cart_id: cart.id });
    }
}