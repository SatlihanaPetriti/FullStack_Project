import { Injectable, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
    private transporter;

    constructor(
        private jwtService: JwtService,
        private configService: ConfigService
    ) {
        this.transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 587,
            secure: false,
            tls: {
                rejectUnauthorized: false
            },
            auth: {
                user: this.configService.get<string>('EMAIL_USER'),
                pass: this.configService.get<string>('EMAIL_PASS')
            }
        });
    }

    generateToken(email: string): string {
        return this.jwtService.sign({ email });
    }

    verifyToken(token: string): string {
        try {
            const payload = this.jwtService.verify(token);
            return payload.email;
        } catch (error) {
            throw new BadRequestException('Invalid or expired token');
        }
    }

    async sendResetEmail(email: string, token: string): Promise<void> {
        console.log('Duke dërguar email te:', email); // shto këtë
        console.log('Token:', token); // shto këtë
        const frontendUrl = this.configService.get<string>('FRONTEND_URL');
        const resetLink = `${frontendUrl}/reset-password?token=${token}`;

        await this.transporter.sendMail({
            to: email,
            subject: 'Reset Your Password',
            html: `
                <h2>Reset Your Password</h2>
                <p>Click this link to reset your password:</p>
                <a href="${resetLink}">${resetLink}</a>
                <p>This link expires in 1 hour.</p>
            `
        });
    }
}