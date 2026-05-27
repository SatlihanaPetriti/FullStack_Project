import { Module } from '@nestjs/common';
import { CategoryController } from './category.controller';
import { CategoryService } from './category.service';
import { CategoryEntity } from './Entity/CategoryEntity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FileService } from './file.service';

@Module({
  imports: [TypeOrmModule.forFeature([CategoryEntity])],
  controllers: [CategoryController],
  providers: [CategoryService, FileService]
})
export class CategoryModule { }
