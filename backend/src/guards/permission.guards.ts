import { Injectable, CanActivate, ExecutionContext } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { ErrorHandler } from "../ErrorHandler/ErrorHandler";
import { HttpStatus } from '@nestjs/common';

@Injectable()
export class PermissionGuard implements CanActivate {
    constructor(
        private reflector: Reflector // refkector perdoret per te lexuar metadata nga endpointet
    ) { }

    canActivate(context: ExecutionContext): boolean | Promise<boolean> {
        //merret kerkesa, kalon ne http, merr objekin e request(getRequest())
        // tanni kemi akses ne request.user(si vjen?- ne auth guard request.user=user)
        const request = context.switchToHttp().getRequest();
        //leximi i roleve nga metadata
        // reflector.get() -lexon metadata
        //roles-celesi i metadata (ato qe vendosim ne @Roles())
        //getHandler- merr hnadlerin metoden aktuale
        const roles = this.reflector.get<string[]>('roles', context.getHandler());
        //vendoset user ne request
        //const user = request.user;
        const user = request.user;

        if (!roles) return true; // nuk ka role te vendosur ne users controller // pa role del  500 Error

        if (!user) {
            throw new ErrorHandler('User not authenticated', HttpStatus.UNAUTHORIZED);
        }

        if (!roles.includes(user.role)) {
            throw new ErrorHandler('You do not have permissions', HttpStatus.FORBIDDEN);
        }

        return true;
    }
}