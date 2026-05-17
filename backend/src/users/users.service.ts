import { HttpStatus, Injectable } from '@nestjs/common';
import { UserEntity } from './Entity/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ErrorHandler } from '../ErrorHandler/ErrorHandler';
import { UserDto } from './DTO/user.dto';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(UserEntity)
        private readonly userRepository: Repository<UserEntity>
    ) { }

    public async findAll(): Promise<UserEntity[]> {
        try {
            return await this.userRepository.find();
        } catch (error) {
            throw new ErrorHandler('Failed to get users', HttpStatus.BAD_REQUEST);
        }
    }

    public async findByEmail(email: string): Promise<UserEntity | null> {
        try {
            return await this.userRepository.findOne({ where: { email } });
        } catch (error) {
            throw new ErrorHandler('Failed to find user by email', HttpStatus.BAD_REQUEST);
        }
    }

    public async registerUser(user: UserDto): Promise<UserEntity> {
        try {
            // const saved =await this.userRepository.save(user)
            // console.log('Saved :', saved.id, 'role:', saved.role)
            // return saved;
            return await this.userRepository.save(user);
        } catch (error) {
            throw new ErrorHandler('Failed to create user', HttpStatus.BAD_REQUEST);
        }
    }

    public async findById(id: number): Promise<UserEntity | null> {
        try {
            return await this.userRepository.findOne({ where: { id } }) ?? null;
        } catch (error) {
            throw new ErrorHandler('Failed to find user by id', HttpStatus.BAD_REQUEST);
        }
    }

    public async updateUser(id: number, data: Partial<UserEntity>): Promise<UserEntity> {
        const existing = await this.userRepository.findOne({ where: { id } });
        if (!existing) {
            throw new ErrorHandler('User not found', HttpStatus.NOT_FOUND);
        }

        try {
            await this.userRepository.update(id, data);
            return await this.userRepository.findOne({ where: { id } });
        } catch (error) {
            throw new ErrorHandler('Failed to update user', HttpStatus.BAD_REQUEST);
        }
    }
}