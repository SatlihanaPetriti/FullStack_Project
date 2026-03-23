import { HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { UserDto } from '../users/DTO/user.dto';
import { LoginDto } from '../users/DTO/login.dto';
import { UserEntity } from '../users/Entity/user.entity';
import * as bcrypt from 'bcrypt';
import { ErrorHandler } from '../ErrorHandler/ErrorHandler';


@Injectable()
export class AuthService {
    constructor(private jwtService:JwtService, private readonly userService:UsersService){}

    public async register(body: UserDto): Promise<{ user: UserEntity, token: string }> {
        try {
            const checkUser = await this.userService.findbyemail(body.email);
            if (checkUser) {
                throw new ErrorHandler("You are already registered", HttpStatus.FOUND);
            }
            //kriptohet password-i
            const hashedPassword =await bcrypt.hash(body.password, 10);
            // pergatitja e te dhenave per ruajtje
            const userData ={
                name: body.name,
                lastname:body.lastname,
                email:body.email,
                password: hashedPassword,
                role:'user',
            };
            //ruhet ne database duke thirrur userservise qe ben save ne database
            const user = await this.userService.registerUser(userData);
            //gjenerohet token JWT lidhur me user id-në, dhe më vonë mund të përdoret për të verifikuar se cili user po bën request.
            const token = await this.jwtService.signAsync({id:user.id});
            return {user, token};
        }catch(error){
            throw new ErrorHandler(error.response, error.status);
        }
}
    public async loginUser(body: LoginDto): Promise<{ user: UserEntity, token: string }>{
    try {
        const user = await this.userService.findbyemail(body.email);
        if(!user){
            throw new ErrorHandler("User with this email was not found", HttpStatus.NOT_FOUND)
        }
        const password = await bcrypt.compare(body.password, user?.password)
        if(!password){
            throw new ErrorHandler ("Incorrect passoword", HttpStatus.NOT_FOUND)
        }
        const token = await this.jwtService.signAsync({id:user.id});
        return { user, token};

    } catch (error) {
        throw new ErrorHandler(error.response, error.status);
    }
}

}
