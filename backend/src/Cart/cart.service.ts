import { Injectable, NotFoundException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ErrorHandler } from '../ErrorHandler/ErrorHandler';
import { Repository } from 'typeorm';
import { Order } from './Entity/order';
import { OrderItem } from './Entity/order-items';
import { Product } from 'src/products/Entity/product.entity';

@Injectable()
export class OrdersService {
    constructor(
        @InjectRepository(Order) private orderRepo: Repository<Order>,
        @InjectRepository(OrderItem) private orderItemRepo: Repository<OrderItem>,
        @InjectRepository(Product) private productRepo: Repository<Product>,
    ) { }

    // shfaq cartin e userit
    // public async getCart(userId: number): Promise<CartItem[]> {
    //     return await this.cartRepository.find({
    //         where: { user_id: userId },
    //         relations: ['product'],
    //     });
    // }

    // shto ne cart
    public async addToOrder(
        user_id: number,
        body: {
            products: { id: number; quantity: number }[];
        },
    ): Promise<Order> {

        // 1. Merr produktet dhe validimi
        const validatedProducts = await Promise.all(
            body.products.map(async (p) => {

                const product = await this.productRepo.findOne({
                    where: { id: p.id },
                });

                if (!product) {
                    throw new Error(`Product ${p.id} not found`);
                }

                if (product.stock < p.quantity) {
                    throw new Error(`Not enough stock for product ${p.id}`);
                }

                return {
                    product,
                    quantity: p.quantity,
                };
            })
        );

        // 2. Llogarit total nga DB
        const totalQuantity = validatedProducts.reduce(
            (sum, item) => sum + item.quantity,
            0
        );

        const totalPrice = validatedProducts.reduce(
            (sum, item) => sum + item.quantity * item.product.price,
            0
        );

        // 3. Krijo Order
        const order = this.orderRepo.create({
            user_id,
            quantity: totalQuantity,
            total: totalPrice,
        });

        const savedOrder = await this.orderRepo.save(order);

        // 4. Krijo Order Items (map + Promise.all)
        const items = await Promise.all(
            validatedProducts.map((item) => {

                const orderItem = this.orderItemRepo.create({
                    order_id: savedOrder.id,
                    product_id: item.product.id,
                    product_quantity: item.quantity,
                    product_price: item.product.price, 
                });

                return this.orderItemRepo.save(orderItem);
            })
        );

        // 5. Return final result
        return {
            ...savedOrder,
            items,
        };
    }


//     public async removeFromCart(userId: number, cartItemId: number): Promise<{ message: string }> {
//         const item = await this.cartRepository.findOne({
//             where: { id: cartItemId, user_id: userId },
//         });

//         if (!item) {
//             throw new ErrorHandler('Cart item not found', HttpStatus.NOT_FOUND);
//         }

//         await this.cartRepository.remove(item);
//         return { message: 'Item removed from cart' };
//     }


//     public async updateQuantity(userId: number, cartItemId: number, quantity: number): Promise<CartItem> {
//         const item = await this.cartRepository.findOne({
//             where: { id: cartItemId, user_id: userId },
//             relations: ['product'],
//         });

//         if (!item) {
//             throw new ErrorHandler('Cart item not found', HttpStatus.NOT_FOUND);
//         }
//         // kontrollohet nese quantity e kerkuar eshte me e madhe se stock
//         if (item.product.stock < quantity) {
//             throw new ErrorHandler(
//                 `Not enough stock. Available: ${item.product.stock}`,
//                 HttpStatus.BAD_REQUEST,
//             );
//         }
//         // perditeson sasine e produktit ne cart sasine aktuale ne db me vleren e re nga request
//         item.quantity = quantity;
//         return await this.cartRepository.save(item);
//     }

//     public async clearCart(userId: number): Promise<{ message: string }> {
//         await this.cartRepository.delete({ user_id: userId });
//         return { message: 'Cart cleared' };
//     }
// }

