import { Controller, Get, Post, Delete, Put, Param, ParseIntPipe, Req, UseGuards, Body, } from '@nestjs/common';
import { CartService } from './cart.service';
import { AuthGuard } from 'src/guards/auth.guard';

@Controller('cart')
@UseGuards(AuthGuard)
export class CartController {
    constructor(private readonly cartService: CartService) { }

    // GET CART
    @Get()
    public async getCart(@Req() req: any) {
        const userId = req.user.id;
        return await this.cartService.getCart(userId);
    }

    // ADD TO CART
    @Post('add')
    public async addToCart(
        @Req() req: any,
        @Body() body: { items: any[] },
    ) {
        const userId = req.user.id;
        return await this.cartService.addToCart(userId, body.items);
    }

    // UPDATE QUANTITY
    @Put(':id')
    public async updateQuantity(
        @Req() req: any,
        @Param('id', ParseIntPipe) cartItemId: number,
        @Body('quantity', ParseIntPipe) quantity: number,
    ) {
        const userId = req.user.id;
        return await this.cartService.updateQuantity(
            userId,
            cartItemId,
            quantity,
        );
    }
    // CLEAR CART
    @Delete('clear')
    public async clearCart(@Req() req: any) {
        const userId = req.user.id;
        return await this.cartService.clearCart(userId);
    }
    // REMOVE ITEM
    @Delete(':id')
    public async removeFromCart(
        @Req() req: any,
        @Param('id', ParseIntPipe) cartItemId: number,
    ) {
        const userId = req.user.id;
        return await this.cartService.removeFromCart(userId, cartItemId);
    }


}