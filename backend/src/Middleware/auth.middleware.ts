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
        const token = req.cookies?.jwt;
        if (!token) {
            throw new ErrorHandler('No token provided', HttpStatus.UNAUTHORIZED);
        }

        let payload: { id: number };
        try {
            payload = this.jwtService.verify(token);
        } catch (err) {
            throw new ErrorHandler('Invalid or expired token', HttpStatus.UNAUTHORIZED);
        }

        const user = await this.userService.findById(payload.id);
        if (!user) {
            throw new ErrorHandler('User not found', HttpStatus.NOT_FOUND);
        }

        req.user = user;
        next();
    }
}