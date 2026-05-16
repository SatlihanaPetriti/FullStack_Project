import { Controller, Get, Param, UseGuards, ParseIntPipe } from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthGuard } from '../guards/auth.guard';
import { Roles } from '../decorators/roles.decorator';

@Controller('users')
@UseGuards(AuthGuard)
export class UserController {
    constructor(private readonly usersService: UsersService) { }

    @Get()
    @Roles('admin')
    public async findAll() {
        return this.usersService.findAll();
    }

    @Get('email/:email')
    @Roles('admin')
    public async findByEmail(@Param('email') email: string) {
        return this.usersService.findByEmail(email);
    }

    @Get(':id')
    @Roles('admin', 'user')
    public async findOne(@Param('id', ParseIntPipe) id: number) {
        return this.usersService.findById(id);
    }
}