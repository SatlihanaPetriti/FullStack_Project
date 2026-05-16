import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './Entity/product.entity';
import { ProductVariant } from './Entity/product-variant.entity';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { UsersModule } from '../users/users.module';
import { FileService } from './file.service';
import { AuthGuard } from 'src/guards/auth.guard';

@Module({
  imports: [
    TypeOrmModule.forFeature([Product, ProductVariant]),
    UsersModule,
  ],
  controllers: [ProductsController],
  providers: [
    ProductsService,
    AuthGuard,
    FileService
  ]
})
export class ProductsModule { }