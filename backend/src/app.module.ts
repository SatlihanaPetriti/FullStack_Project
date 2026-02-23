import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductsModule } from './products/products.module';
import { Product } from './products/Entity/product.entity';
import { ProductVariant } from './products/Entity/product-variant.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',           
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'Inna1998',
      database: 'plantshop',   
      entities: [Product, ProductVariant],
      synchronize: true,        
      }),ProductsModule,            
  ],
  controllers: [],
  providers: [],
})
export class AppModule { }