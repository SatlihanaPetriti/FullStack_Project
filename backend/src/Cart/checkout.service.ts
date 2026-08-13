import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cart } from './Entity/cart';
import { CartItem } from './Entity/cart-items';
import { Product } from 'src/products/Entity/product.entity';
import { Order, OrderStatus } from 'src/orders/Entity/order.entity';
import { OrderItem } from 'src/orders/Entity/order-item.entity';
import Stripe from 'stripe';

@Injectable()
export class CheckoutService {
    private stripe = new Stripe(import.meta.env.STRIPE_SECRET_KEY as string);

    constructor(
        @InjectRepository(Cart) private cartRepo: Repository<Cart>,
        @InjectRepository(CartItem) private cartItemRepo: Repository<CartItem>,
        @InjectRepository(Product) private productRepo: Repository<Product>,
        @InjectRepository(Order) private orderRepo: Repository<Order>,
        @InjectRepository(OrderItem) private orderItemRepo: Repository<OrderItem>,
    ) { }

    private async getValidatedCart(userId: number) {
        const cart = await this.cartRepo.findOne({
            where: { user_id: userId },
            relations: ['items', 'items.product'],
        });

        if (!cart || cart.items.length === 0) {
            throw new BadRequestException('Cart is empty');
        }

        for (const item of cart.items) {
            if (!item.product) {
                throw new NotFoundException(`Product ${item.product_id} not found`);
            }
            if (item.product.stock < item.quantity) {
                throw new BadRequestException(
                    `"${item.product.title}" has only ${item.product.stock} units in stock`,
                );
            }
        }

        return cart;
    }

    public async createPaymentIntent(userId: number) {
        const cart = await this.getValidatedCart(userId);

        const paymentIntent = await this.stripe.paymentIntents.create({
            amount: Math.round(cart.total_price * 100),
            currency: 'usd',
            payment_method_types: ['card'],
            metadata: { userId: String(userId) },
        });

        return { clientSecret: paymentIntent.client_secret };
    }

    public async confirmOrder(userId: number, paymentIntentId: string) {
        const intent = await this.stripe.paymentIntents.retrieve(paymentIntentId);

        if (intent.status !== 'succeeded') {
            throw new BadRequestException('Payment not completed');
        }

        if (intent.metadata.userId !== String(userId)) {
            throw new BadRequestException('Unauthorized');
        }

        const cart = await this.getValidatedCart(userId);

        const order = this.orderRepo.create({
            user_id: userId,
            total_price: cart.total_price,
            status: OrderStatus.PENDING,
            payment_stripe_id: paymentIntentId,
        });
        const savedOrder = await this.orderRepo.save(order);

        const orderItems = cart.items.map((item) =>
            this.orderItemRepo.create({
                order_id: savedOrder.id,
                product_id: item.product_id,
                product_title: item.product.title,
                quantity: item.quantity,
                price: item.price,
            }),
        );
        await this.orderItemRepo.save(orderItems);

        const updatedProducts = cart.items.map((item) => {
            item.product.stock -= item.quantity;
            return item.product;
        });
        await this.productRepo.save(updatedProducts);

        await this.cartItemRepo.delete({ cart_id: cart.id });
        await this.cartRepo.remove(cart);

        return {
            message: 'Order placed successfully',
            orderId: savedOrder.id,
        };
    }
}