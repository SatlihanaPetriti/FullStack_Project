import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './Entity/product.entity';
import { ProductVariant } from './Entity/product-variant.entity';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { UsersModule } from '../users/users.module';
import { AuthGuard } from '../guards/auth.guards';
import { PermissionGuard } from '../guards/permission.guards';
import { FileService } from '../products/file.service';
@Module({
  imports: [
    TypeOrmModule.forFeature([Product, ProductVariant]),
    UsersModule,   //UsersModule importohet sepse AuthGuard ka nevoje per UsersService
  ],
  controllers: [ProductsController],
  providers: [
    ProductsService,
    AuthGuard,       
    PermissionGuard, 
    FileService
  ]
})
export class ProductsModule { }