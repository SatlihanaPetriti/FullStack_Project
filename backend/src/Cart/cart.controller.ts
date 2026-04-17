import { Controller, Get, Post, Delete, Put, Param, ParseIntPipe, Req, UseGuards, Body } from '@nestjs/common';
import { OrdersService } from './cart.service';
import { AuthGuard } from '../guards/auth.guards';

@Controller('order')
@UseGuards(AuthGuard)
export class CartController {
    constructor(private readonly orderService: OrdersService) { }

    // @Get()
    // public async getCart(@Req() req: any) {
    //     const userId = req.user.id;
    //     return await this.cartService.getCart(userId);
    // }

    
    @Post('add')
    public async addToOrder(
    @Req() req: any,
    @Body() body: {
        products: { id: number; quantity: number; price: number }[];
    },
) {
    const userId = req.user.id;
    return await this.orderService.addToOrder(userId, body);
}

    // @Put(':id')
    // public async updateQuantity(
    //     @Req() req: any,
    //     @Param('id', ParseIntPipe) cartItemId: number,
    //     @Body('quantity', ParseIntPipe) quantity: number,
    // ) {
    //     const userId = req.user.id;
    //     return await this.cartService.updateQuantity(userId, cartItemId, quantity);
    // }

    // @Delete('clear')
    // public async clearCart(@Req() req: any) {
    //     const userId = req.user.id;
    //     return await this.cartService.clearCart(userId);
    // }

    // @Delete(':id')
    // public async removeFromCart(
    //     @Req() req: any,
    //     @Param('id', ParseIntPipe) cartItemId: number,
    // ) {
    //     const userId = req.user.id;
    //     return await this.cartService.removeFromCart(userId, cartItemId);
    // }


}