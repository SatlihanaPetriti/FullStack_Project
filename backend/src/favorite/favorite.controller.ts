import {
    Controller, Get, Post, Delete, Param, ParseIntPipe, Req, UseGuards, HttpCode, HttpStatus,
} from '@nestjs/common';
import { FavoritesService } from './favorite.service';
import { AuthGuard } from '../guards/auth.guards';


@Controller('favorites')
@UseGuards(AuthGuard)
export class FavoritesController {
        constructor(private readonly favoritesService: FavoritesService) { }

    @Get()
    public async getFavorites(@Req() req: any) {
        const user_id = req.user.id;
        return this.favoritesService.getFavorites(user_id);
    }
    @Post(':productId')
    public async addFavorite(
        @Req() req: any,
        @Param('productId', ParseIntPipe) productId: number,
    ) {
        const user_id = req.user.id;
        return this.favoritesService.addFavorite(user_id, productId);
    }
    @Delete(':productId')
    public async removeFavorite(
        @Req() req: any,
        @Param('productId', ParseIntPipe) productId: number,
    ) {
        const user_id = req.user.id;
        return this.favoritesService.removeFavorite(user_id, productId);
    }

    @Get('check/:productId')
    public async checkFavorite(
        @Req() req: any,
        @Param('productId', ParseIntPipe) productId: number,
    ) {
        const user_id = req.user.id;
        const isFavorite = await this.favoritesService.isFavorite(user_id, productId);
        return { isFavorite };
    }
}