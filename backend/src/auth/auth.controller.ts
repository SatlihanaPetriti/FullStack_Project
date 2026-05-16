import { Controller, Post, Body, Res, Get, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserDto } from '../users/DTO/user.dto';
import { UserEntity } from '../users/Entity/user.entity';
import { LoginDto } from '../users/DTO/login.dto';
import type { Response, Request } from 'express';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Post('register')
    public async register(
        @Body() param: UserDto,
        @Res({ passthrough: true }) response: Response
    ): Promise<UserEntity> {
        const { user, token } = await this.authService.register(param);
        response.cookie('jwt', token, { httpOnly: true });
        return user;
    }

    @Post('login')
    public async login(
        @Body() param: LoginDto,
        @Res({ passthrough: true }) response: Response
    ): Promise<UserEntity> {
        const { user, token } = await this.authService.login(param);
        response.cookie('jwt', token, { httpOnly: true });
        return user;
    }

    @Post('logout')
    public async logout(@Res({ passthrough: true }) response: Response) {
        response.clearCookie('jwt');
        return { "message": "success", "status": 201 };
    }

    @Get('checkUser')
    public async checkAuthUser(@Req() request: Request): Promise<UserEntity> {
        const id = await this.authService.authUserId(request);
        return await this.authService.getUserById(id);
    }

    @Post('forgot-password')
    public async forgotPassword(@Body('email') email: string) {
        return await this.authService.forgotPassword(email);
    }

    @Post('reset-password')
    public async resetPassword(@Body() body: { token: string; password: string }) {
        return this.authService.resetPassword(body.token, body.password);
    }
}