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
        console.log(' @IsPublic?', isPublic ? 'yes ' : 'no')
        if (isPublic) return true;

        const request = context.switchToHttp().getRequest();
        const user = request.user;
        if (!user) {
            throw new ErrorHandler('No user found', HttpStatus.NOT_FOUND);
        }
        console.log('User role:', user.role)

        const requiredRoles = this.reflector.get<string[]>('roles', context.getHandler());
        console.log('--requiredRoles:', requiredRoles)
        if (!requiredRoles) return true;
       
        const userRoles: string[] = Array.isArray(user.role) ? user.role : [user.role];
        console.log('User role:', userRoles)
        
        const hasRole = requiredRoles.some(role => userRoles.includes(role));
        console.log ('has role:', hasRole )
        if (!hasRole) {
            throw new ErrorHandler('Access denied', HttpStatus.FORBIDDEN);
        }

        return true;
    }
}