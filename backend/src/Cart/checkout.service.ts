import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cart } from './Entity/cart';
import { CartItem } from './Entity/cart-items';
import { Product } from 'src/products/Entity/product.entity';
import Stripe from 'stripe';

@Injectable()
export class CheckoutService {
    private stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);
    constructor(
        @InjectRepository(Cart) private cartRepo: Repository<Cart>,
        @InjectRepository(CartItem) private cartItemRepo: Repository<CartItem>,
        @InjectRepository(Product) private productRepo: Repository<Product>,
    ) { }

    // STEP 1 — Krijo PaymentIntent
    async createPaymentIntent(userId: number) {
        const cart = await this.cartRepo.findOne({
            where: { user_id: userId },
            relations: ['items', 'items.product'],
        });

        if (!cart || cart.items.length === 0) {
            throw new BadRequestException('Cart is empty');
        }

        // Verifiko stock para se te krijosh payment
        for (const item of cart.items) {
            if (!item.product) {
                throw new NotFoundException(`Product ${item.product_id} not found`);
            }
            if (item.product.stock < item.quantity) {
                throw new BadRequestException(
                    `"${item.product.id}" has only ${item.product.stock} units in stock`
                );
            }
        }

        const paymentIntent = await this.stripe.paymentIntents.create({
            amount: Math.round(cart.total_price * 100),
            currency: 'usd',
            payment_method_types: ['card'],
            metadata: { userId: String(userId) },
        });

        return { clientSecret: paymentIntent.client_secret };
    }

    //  verifikpagesen + ul stock + pastro cart
    async confirmOrder(userId: number, paymentIntentId: string) {
        const intent = await this.stripe.paymentIntents.retrieve(paymentIntentId);

        if (intent.status !== 'succeeded') {
            throw new BadRequestException('Payment not completed');
        }

        if (intent.metadata.userId !== String(userId)) {
            throw new BadRequestException('Unauthorized');
        }

        const cart = await this.cartRepo.findOne({
            where: { user_id: userId },
            relations: ['items', 'items.product'],
        });

        if (!cart) throw new BadRequestException('Cart not found');

        // Ul stock
        for (const item of cart.items) {
            item.product.stock -= item.quantity;
            await this.productRepo.save(item.product);
        }

        // Pastro cart
        await this.cartItemRepo.delete({ cart_id: cart.id });
        await this.cartRepo.remove(cart);

        return { message: 'Order placed successfully' };
    }
}