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
@Module({
  imports: [
    TypeOrmModule.forFeature([Cart, CartItem, Product]),
    UsersModule,
    ProductsModule,
    JwtModule,
  ],
  controllers: [CartController],
  providers: [CartService],
})
export class CartModule { }
