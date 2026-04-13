import { Module } from '@nestjs/common';
import { EmailService } from './email.service';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
        }),
        JwtModule.registerAsync({
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => ({
                secret: configService.get<string>('JWT_RESET_SECRET'),
                signOptions: { expiresIn: '3600s' }
            })
        })
    ],
    providers: [EmailService],
    exports: [EmailService]
})
export class EmailModule { }