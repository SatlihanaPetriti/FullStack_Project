import { HttpStatus, Injectable } from '@nestjs/common';
import { UserEntity } from './Entity/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ErrorHandler } from '../ErrorHandler/ErrorHandler';
import { UserDto } from './DTO/user.dto';

@Injectable()
export class UsersService {
    constructor(@InjectRepository(UserEntity) private readonly userRepository: Repository<UserEntity>) { }

    public async findAll(): Promise<UserEntity[]> {
        try {
            return await this.userRepository.find();
        } catch (error) {
            throw new ErrorHandler(error.message, HttpStatus.NOT_FOUND);
        }
    }

    public async findByEmail(email: string): Promise<UserEntity | null> {
        try {
            const result = await this.userRepository.findOne({ where: { email } });
            return result;
        } catch (error) {
            throw new ErrorHandler(error.message, HttpStatus.NOT_FOUND);
        }
    }

    public async registerUser(user: UserDto): Promise<UserEntity> {
        try {
            return await this.userRepository.save(user);
        } catch (error) {
            throw new ErrorHandler(error.message, HttpStatus.BAD_REQUEST);
        }
    }

    public async findById(id: number): Promise<UserEntity | null> {
        try {
            const result = await this.userRepository.findOne({ where: { id } });
            return result;
        } catch (error) {
            throw new ErrorHandler(error.message, HttpStatus.NOT_FOUND);
        }
    }

    public async updateUser(id: number, data: Partial<UserEntity>): Promise<UserEntity> {
        try {
            await this.userRepository.update(id, data);
            const updatedUser = await this.userRepository.findOne({ where: { id } });

            if (!updatedUser) {
                throw new ErrorHandler('User not found', HttpStatus.NOT_FOUND);
            }

            return updatedUser;
        } catch (error) {
            throw new ErrorHandler(error.message, HttpStatus.BAD_REQUEST);
        }
    }
}