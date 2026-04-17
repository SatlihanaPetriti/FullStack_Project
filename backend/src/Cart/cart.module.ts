import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm/dist/typeorm.module';
import { CartController } from './cart.controller';
import { CartService } from './cart.service';
import { CartItem } from './Entity/order';
import { UsersModule } from 'src/users/users.module';
import { ProductsModule } from 'src/products/products.module';
import { JwtModule } from '@nestjs/jwt';
import { Product } from 'src/products/Entity/product.entity';
@Module({
  imports: [
    TypeOrmModule.forFeature([CartItem, Product]),
    UsersModule,
    ProductsModule,
    JwtModule,
  ],
  controllers: [CartController],
  providers: [CartService],
  exports: [CartService],
})
export class CartModule { }
