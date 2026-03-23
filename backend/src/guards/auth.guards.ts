import { CanActivate, Injectable, ExecutionContext, HttpException, HttpStatus } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { JwtService } from "@nestjs/jwt";
import { UsersService } from "src/users/users.service";


@Injectable()
export class AuthGuard implements CanActivate {
    constructor(
        private reflector: Reflector, //lexon metadata
        private jwtService: JwtService, // verifikon dhe dekodon jwt
        private userService: UsersService) { } // gjen perdoruesin ne db

    async canActivate(context: ExecutionContext): Promise<boolean> {
        // lexon metadata me emrin ispublic nga endpoint, 
        const isPublic = this.reflector.get<string[]>('isPublic', context.getHandler());
        //nese eshte e shenuar si publik lejohet pa autentifikim
        if (isPublic) {
            return true;
        }
        // marrja e kerkeses dhe cookie
        const request = context.switchToHttp().getRequest();
        const jwt = request.cookies.jwt;
        //nese ka token 
        if (!jwt) {
            throw new HttpException("Unauthorized", HttpStatus.UNAUTHORIZED)
        }
        //verifikimi i token nese eshe i vlefshem(jwtService.verify())
        try {
            const payload: any = this.jwtService.verify(jwt);
            // merr id nga payload (id) gjen perdoruesin ne database
            const user = await this.userService.findbyId(payload.id);
            if (!user) {
                throw new HttpException('User not found', HttpStatus.UNAUTHORIZED);
            }
            // vendos perdoruesin ne kerkese
            request.user = user;
            return true;
        } catch (err) {
            throw new HttpException('Invalid token', HttpStatus.UNAUTHORIZED);
        }
    }
}