import { Controller, Get, Post, Param, Body, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { UserDto } from './DTO/user.dto';
import { AuthGuard } from '../guards/auth.guards';
import { PermissionGuard } from '../guards/permission.guards';
import { Roles } from 'src/decorators/roles.decorator';

@Controller('users')
@UseGuards(AuthGuard, PermissionGuard)
export class UserController {
    constructor(private readonly usersService: UsersService) { }


    @Get()
    @Roles('admin')
    findAll() {
        return this.usersService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: number) {
        return this.usersService.findbyId(id);
    }

    @Post()
    @Roles('admin')
    create(@Body() userDto: UserDto) {
        return this.usersService.registerUser(userDto);
    }

}