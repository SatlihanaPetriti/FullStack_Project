import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import { UserDto } from 'src/users/DTO/user.dto';
import { LoginDto } from 'src/users/DTO/login.dto';
import { UserEntity } from 'src/users/Entity/user.entity';
import * as bcrypt from 'bcrypt';
import { ErrorHandler } from '../ErrorHandler/ErrorHandler';
import { Request } from "express";

@Injectable()
export class AuthService {
    constructor(private jwtService: JwtService,
        private readonly userService: UsersService) { }

    public async register(body: UserDto): Promise<{ user: UserEntity, token: string }> {
        try {
            const checkUser = await this.userService.findByEmail(body.email);
            if (checkUser) {
                throw new ErrorHandler("You are already registered", HttpStatus.FOUND);
            }

            const hashedPassword = await bcrypt.hash(body.password, 10);
            const userData = {
                name: body.name,
                lastname: body.lastname,
                email: body.email,
                password: hashedPassword,
                role: 'user',
            };
            const user = await this.userService.registerUser(userData);

            const token = await this.jwtService.signAsync({ id: user.id });
            return { user, token };
        } catch (error) {
            throw new ErrorHandler(error.response, error.status);
        }
    }


    public async loginUser(body: LoginDto): Promise<{ user: UserEntity, token: string }> {
        try {
            const user = await this.userService.findByEmail(body.email);
            if (!user) {
                throw new ErrorHandler("user with this email was not found", HttpStatus.NOT_FOUND)
            }
            const password = await bcrypt.compare(body.password, user?.password)
            if (!password) {
                throw new ErrorHandler("your password is incorrect", HttpStatus.NOT_FOUND)
            }
            const token = await this.jwtService.signAsync({ id: user.id });
            return { user, token };
        } catch (error) {
            throw new ErrorHandler(error.response, error.status);
        }
    }

    public async authUserId(request: Request): Promise<number> {
        try {
            const jwt = request.cookies?.jwt;
            if (!jwt) {
                throw new ErrorHandler("You are anauthorized", HttpStatus.UNAUTHORIZED);
            }

            const decodedToken: any = this.jwtService.decode(jwt);
            const currentTime = Math.floor(Date.now() / 1000);

            if (decodedToken.exp < currentTime) {
                throw new HttpException("Token expired", HttpStatus.UNAUTHORIZED);
            }
            const { id } = await this.jwtService.verifyAsync(jwt);
            return id;
        } catch (error) {
            throw new ErrorHandler(error.response, error.status);
        }
    }



    public async getUserById(id: number): Promise<UserEntity[]> {
        try {
            const result = await this.userService.findById(id);
            if (!result) {
                throw new ErrorHandler("User with this id was not found", HttpStatus.NOT_FOUND);
            }
            return result;
        } catch (error) {
            throw new ErrorHandler(error.response, error.status);
        }
    }
}
