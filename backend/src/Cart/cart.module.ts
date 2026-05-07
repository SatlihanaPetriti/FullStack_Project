import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm/dist/typeorm.module';
import { CartController } from './cart.controller';
import { UsersModule } from 'src/users/users.module';
import { ProductsModule } from 'src/products/products.module';
import { JwtModule } from '@nestjs/jwt';
import { Cart } from './Entity/cart';
import { CartItem } from './Entity/cart-items';
import { Product } from 'src/products/Entity/product.entity';
import { CartService } from './cart.service';
import { CheckoutService } from './checkout.service';
import { CheckoutController } from './checkout.controller';
import { Order } from 'src/orders/Entity/order.entity';
import { OrderItem } from 'src/orders/Entity/order-item.entity';
@Module({
  imports: [
    TypeOrmModule.forFeature([Cart, CartItem, Product, Order, OrderItem]),
    UsersModule,
    JwtModule,
  ],
  controllers: [CartController, CheckoutController],
  providers: [CartService, CheckoutService],
})
export class CartModule { }
