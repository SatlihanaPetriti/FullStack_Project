import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm/dist/typeorm.module';
import { Order } from './Entity/order.entity';
import { OrderItem } from './Entity/order-item.entity';
import { OrdersService } from './orders.service';
import { OrderController } from './orders.controller';
import { JwtModule } from '@nestjs/jwt';
import { ProductsModule } from 'src/products/products.module';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Order, OrderItem]),
    JwtModule,
    UsersModule,
    ProductsModule,
    JwtModule,
  ],
  controllers: [OrderController],
  providers: [OrdersService],
  exports: [ OrdersService],
})
export class OrderModule { }