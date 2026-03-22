import { HttpStatus, Injectable } from '@nestjs/common';
import { UserEntity } from './Entity/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UserDto } from './DTO/user.dto';
import { ErrorHandler } from '../ErrorHandler/ErrorHandler';


@Injectable()
export class UsersService {
    constructor(@InjectRepository(UserEntity) private readonly userRepository: Repository<UserEntity>){}
    
    public async findbyemail(email:string): Promise<UserEntity | null>{
        try{
            const result =await this.userRepository.findOneBy({email})
            return result;
        } catch(error){
            throw new ErrorHandler(error.message, HttpStatus.NOT_FOUND)
        }

    }

    public async registerUser(user:UserDto): Promise<UserEntity>{
        try{
            return await this.userRepository.save(user);
        }catch (error){
            throw new ErrorHandler(error.message, HttpStatus.BAD_REQUEST);
        }
    }

    public async findbyId(id:number): Promise<UserEntity[]>{
        try {
            const result =await this.userRepository.findBy({id});
            return result;
        } catch (error){
            throw new ErrorHandler (error.message, HttpStatus.NOT_FOUND);
        }
       
    }

}
