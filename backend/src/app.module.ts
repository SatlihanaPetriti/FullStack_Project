import { Module, MiddlewareConsumer, NestModule, RequestMethod } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductsModule } from './products/products.module';
import { Product } from './products/Entity/product.entity';
import { ProductVariant } from './products/Entity/product-variant.entity';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { UserEntity } from './users/Entity/user.entity';
import { CategoryModule } from './Category/category.module';
import { CategoryEntity } from './Category/Entity/CategoryEntity';
import { MailModule } from './mail/mail.module';
import { FavoriteModule } from './favorite/favorite.module';
import { Favorite } from './favorite/Entity/favorite.entity';
import { CartModule } from './Cart/cart.module';
import { Cart } from './Cart/Entity/cart';
import { CartItem } from './Cart/Entity/cart-items';
import { Subscriber } from './mail/Entity/subscriber.entity';
import { OrderModule } from './orders/orders.module';
import { Order } from './orders/Entity/order.entity';
import { OrderItem } from './orders/Entity/order-item.entity';
import { SendEmailModule } from './send_email/send_email.module';
import { AuthMiddleware } from './Middleware/auth.middleware';
@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
        }),
        TypeOrmModule.forRootAsync({
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => ({
                type: 'mysql',
                host: configService.get<string>('DB_HOST'),
                port: configService.get<number>('DB_PORT'),
                username: configService.get<string>('DB_USERNAME'),
                password: configService.get<string>('DB_PASSWORD'),
                database: configService.get<string>('DB_NAME'),
                entities: [Product, CategoryEntity, ProductVariant, UserEntity, Favorite, CartItem, Cart, Order, OrderItem, Subscriber],
                synchronize: true,
            }),
        }),
        ProductsModule,
        AuthModule,
        UsersModule,
        CategoryModule,
        MailModule,
        FavoriteModule,
        CartModule,
        OrderModule,
        SendEmailModule,
    ],
})
export class AppModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer
            .apply(AuthMiddleware)
            .forRoutes(
                // auth
                { path: 'auth/checkUser', method: RequestMethod.GET },
                { path: 'auth/logout', method: RequestMethod.POST },
                // users
                { path: 'users', method: RequestMethod.ALL },
                { path: 'users/*path', method: RequestMethod.ALL },
                // products 
                { path: 'products', method: RequestMethod.POST },
                { path: 'products/*path', method: RequestMethod.PUT },
                { path: 'products/*path', method: RequestMethod.DELETE },
                // kerkojne login
                { path: 'orders', method: RequestMethod.ALL },
                { path: 'orders/*path', method: RequestMethod.ALL },
                { path: 'favorites', method: RequestMethod.ALL },
                { path: 'favorites/*path', method: RequestMethod.ALL },
                { path: 'cart', method: RequestMethod.ALL },
                { path: 'cart/*path', method: RequestMethod.ALL },
                { path: 'checkout/*path', method: RequestMethod.ALL },
            );
    }
}
