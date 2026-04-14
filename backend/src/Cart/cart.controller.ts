import { Controller, Get, Post, Delete, Put, Param, ParseIntPipe, Req, UseGuards, Body } from '@nestjs/common';
import { CartService } from './cart.service';
import { AuthGuard } from '../guards/auth.guards';
import { AddToCartDto } from './DTO/cart.dto';

@Controller('cart')
@UseGuards(AuthGuard)
export class CartController {
    constructor(private readonly cartService: CartService) { }

    @Get()
    public async getCart(@Req() req: any) {
        const userId = req.user.id;
        return await this.cartService.getCart(userId);
    }

    @Post('add')
    public async addToCart(
        @Req() req: any,
        @Body() dto: AddToCartDto,
    ) {
        const userId = req.user.id;
        return await this.cartService.addToCart(userId, dto);
    }

    @Put(':id')
    public async updateQuantity(
        @Req() req: any,
        @Param('id', ParseIntPipe) cartItemId: number,
        @Body('quantity', ParseIntPipe) quantity: number,
    ) {
        const userId = req.user.id;
        return await this.cartService.updateQuantity(userId, cartItemId, quantity);
    }

    @Delete('clear')
    public async clearCart(@Req() req: any) {
        const userId = req.user.id;
        return await this.cartService.clearCart(userId);
    }

    @Delete(':id')
    public async removeFromCart(
        @Req() req: any,
        @Param('id', ParseIntPipe) cartItemId: number,
    ) {
        const userId = req.user.id;
        return await this.cartService.removeFromCart(userId, cartItemId);
    }


}