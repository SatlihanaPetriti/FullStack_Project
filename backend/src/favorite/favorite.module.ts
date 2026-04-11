import { Module } from '@nestjs/common';
import { FavoritesController } from './favorite.controller';
import { FavoritesService } from './favorite.service';
import { Favorite } from './Entity/favorite.entity';
import { TypeOrmModule } from '@nestjs/typeorm/dist/typeorm.module';
import { UsersModule } from 'src/users/users.module';
import { ProductsModule } from 'src/products/products.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [TypeOrmModule.forFeature([Favorite]), UsersModule, ProductsModule, JwtModule],
  controllers: [FavoritesController],
  providers: [FavoritesService]
})
export class FavoriteModule {}
