import { Controller, Get, Post, Delete, Patch, Param, ParseIntPipe, Req, UseGuards, Body } from '@nestjs/common';
import { CartService } from './cart.service';
import { AuthGuard } from '../guards/auth.guards';

@Controller('cart')
@UseGuards(AuthGuard)
export class CartController {
    constructor(private readonly cartService: CartService) { }

    // GET /cart → shiko cart-in
    @Get()
    public async getCart(@Req() req: any) {
        const user_id = req.user.id;
        return this.cartService.getCart(user_id);
    }

    // POST /cart/:productId → shto produkt
    @Post(':productId')
    public async addToCart(
        @Req() req: any,
        @Param('productId', ParseIntPipe) productId: number,
        @Body('quantity') quantity?: number,
    ) {
        const user_id = req.user.id;
        return this.cartService.addToCart(user_id, productId, quantity);
    }

    // PATCH /cart/:productId → ndrysho quantity
    @Patch(':productId')
    public async updateQuantity(
        @Req() req: any,
        @Param('productId', ParseIntPipe) productId: number,
        @Body('quantity', ParseIntPipe) quantity: number,
    ) {
        const user_id = req.user.id;
        return this.cartService.updateQuantity(user_id, productId, quantity);
    }

    // DELETE /cart/:productId → hiq produkt
    @Delete(':productId')
    public async removeFromCart(
        @Req() req: any,
        @Param('productId', ParseIntPipe) productId: number,
    ) {
        const user_id = req.user.id;
        return this.cartService.removeFromCart(user_id, productId);
    }
}