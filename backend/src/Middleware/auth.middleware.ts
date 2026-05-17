import { HttpStatus, Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { ErrorHandler } from '../ErrorHandler/ErrorHandler';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
    constructor(
        private jwtService: JwtService,
        private userService: UsersService,
    ) { }

    async use(req: Request, res: Response, next: NextFunction) {
        console.log('Route:', req.method, req.url)
        
        const token = req.cookies?.jwt;
        console.log('Token:', token)

        if (!token) {
            throw new ErrorHandler('No token provided', HttpStatus.UNAUTHORIZED);
        }

        let payload: { id: number };
        try {
            payload = this.jwtService.verify(token);
            console.log('Token valid:', payload)
        } catch (err) {
            throw new ErrorHandler('Invalid or expired token', HttpStatus.UNAUTHORIZED);
        }

        const user = await this.userService.findById(payload.id);
        console.log('User from DB:', user.id)
        if (!user) {
            throw new ErrorHandler('User not found', HttpStatus.NOT_FOUND);
        }
        req.user = user;
        console.log('---Req:',req.user)
        next();
    }
}