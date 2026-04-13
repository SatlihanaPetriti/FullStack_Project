import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Favorite } from './Entity/favorite.entity';

@Injectable()
export class FavoritesService {
    constructor(
        @InjectRepository(Favorite) private readonly favoriteRepo: Repository<Favorite>,
    ) { }

    public async getFavorites(user_id: number): Promise<Favorite[]> {
        return this.favoriteRepo.find({
            where: { user_id },
            relations: ['product', 'product.variants', 'product.category'],
        });
    }

    public async addFavorite(user_id: number, product_id: number): Promise<Favorite> {
        const existing = await this.favoriteRepo.findOne({ where: { user_id, product_id } });
        if (existing) {
            throw new ConflictException('Product is already in favorites');
        }
        const favorite = this.favoriteRepo.create({ user_id, product_id });
        return this.favoriteRepo.save(favorite);
    }


    public async removeFavorite(user_id: number, product_id: number): Promise<void> {
        const favorite = await this.favoriteRepo.findOne({ where: { user_id, product_id } });
        if (!favorite) {
            throw new NotFoundException('Favorite not found');
        }
        await this.favoriteRepo.remove(favorite);
    }

}