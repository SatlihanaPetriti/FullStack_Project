import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { HttpStatus } from '@nestjs/common';
import { ErrorHandler } from '../ErrorHandler/ErrorHandler';
import { IS_PUBLIC_KEY } from 'src/decorators/public.decorator';

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(private reflector: Reflector) { }

    public canActivate(context: ExecutionContext): boolean {
       
        const isPublic = this.reflector.get<boolean>(IS_PUBLIC_KEY, context.getHandler());
        if (isPublic) return true;

        const request = context.switchToHttp().getRequest();
        
        const user = request.user;

        if (!user) {
            throw new ErrorHandler('No user found', HttpStatus.NOT_FOUND);
        }

        const requiredRoles = this.reflector.get<string[]>('roles', context.getHandler());

        if (!requiredRoles) return true;

        const userRoles: string[] = Array.isArray(user.role) ? user.role : [user.role];

        const hasRole = requiredRoles.some(role => userRoles.includes(role));

        if (!hasRole) {
            throw new ErrorHandler('Access denied', HttpStatus.FORBIDDEN);
        }

        return true;
    }
}