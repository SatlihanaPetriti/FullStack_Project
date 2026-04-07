import { BadRequestException, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { UserDto } from '../users/DTO/user.dto';
import { LoginDto } from '../users/DTO/login.dto';
import { UserEntity } from '../users/Entity/user.entity';
import * as bcrypt from 'bcrypt';
import { ErrorHandler } from '../ErrorHandler/ErrorHandler';
import { Request } from "express";
import { EmailService } from '../email/email.service';
@Injectable()
export class AuthService {
    constructor(private jwtService: JwtService,
        private readonly userService: UsersService,
        private readonly emailService: EmailService
    
    ) { }

    public async register(body: UserDto): Promise<{ user: UserEntity, token: string }> {
        try {
            const checkUser = await this.userService.findByEmail(body.email);
            if (checkUser) {
                throw new ErrorHandler(
                    "User already exists with this email",
                    HttpStatus.CONFLICT
                );
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
                throw new ErrorHandler("User with this email was not found", HttpStatus.NOT_FOUND)
            }
            const password = await bcrypt.compare(body.password, user?.password)
            if (!password) {
                throw new ErrorHandler("Your password is incorrect", HttpStatus.UNAUTHORIZED)
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
    public async getUserById(id: number): Promise<UserEntity> {  
        const result = await this.userService.findById(id);
        if (!result) {
            throw new ErrorHandler("User with this id was not found", HttpStatus.NOT_FOUND);
        }
        return result;
    }
    public async forgotPassword(email: string): Promise<{ message: string }> {
        // Gjej user-in
        const user = await this.userService.findByEmail(email);

        // Nëse user-i nuk ekziston, kthe të njëjtin mesazh për siguri
        if (!user) {
            return { message: 'If email exists, reset link will be sent' };
        }

        // Gjenero token
        const token = this.emailService.generateToken(email);

        // Ruaj token-in në database
        user.resetToken = token;
        user.resetTokenExpires=new Date(Date.now() + 3600000)
        await this.userService.updateUser(user.id, user);

        // Dërgo email
        await this.emailService.sendResetEmail(email, token);

        return { message: 'Reset link sent to your email' };
    }

    public async resetPassword(token: string, newPassword: string): Promise<{ message: string }> {
        // Verifiko token-in dhe merr email-in
        const email = this.emailService.verifyToken(token);

        // Gjej user-in
        const user = await this.userService.findByEmail(email);
        if (!user) {
            throw new BadRequestException('User not found');
        }

        // Verifiko token-in në database
        if (user.resetToken !== token) {
            throw new BadRequestException('Invalid token');
        }
        if (!user.resetTokenExpires || user.resetTokenExpires < new Date()) {
            throw new BadRequestException('Token Expires');
        }

        // Hasho password-in e ri
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Përditëso password-in dhe fshij token-in
        user.password = hashedPassword;
        user.resetToken = null;
        await this.userService.updateUser(user.id, user);

        return { message: 'Password reset successfully' };
    }
    }