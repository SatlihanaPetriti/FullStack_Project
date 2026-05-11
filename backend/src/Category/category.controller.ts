import { Controller, Get, Post, Put, Delete, Param, Body, UseInterceptors, UploadedFiles, Res, ParseIntPipe } from '@nestjs/common';
import express from 'express';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { CategoryService } from './category.service';
import { FormatDateImage } from '../Helper/FormatDateImage';
import { CategoryDTO } from './DTO/Category.dto';

@Controller('categories')
export class CategoryController {
    constructor(private readonly categoriesService: CategoryService) { }

    @Get('uploads/:filename')
    public async serveImage(@Param('filename') filename: string, @Res() res: express.Response) {
        res.sendFile(filename, { root: './uploads/category' });
    }
    @Get()
    public async findAll() {
        return await this.categoriesService.findAll();
    }
    @Get(':id')
    public async findOne(@Param('id', ParseIntPipe) id: number) {
        return await this.categoriesService.findOne(id);
    }
    @Post()
    @UseInterceptors(
        FileFieldsInterceptor(
            [{ name: 'image', maxCount: 1 }],
            {
                storage: diskStorage({
                    destination: './uploads/category',
                    filename: (req, file, cb) => {
                        const formatDate = new FormatDateImage();
                        cb(null, formatDate.generateDate(file.originalname));
                    }
                })
            }
        )
    )
    
    public async create(
        @Body() body: CategoryDTO,
        @UploadedFiles() files: { image?: Express.Multer.File[] }
    ) {
        const image = files?.image?.[0]?.filename;
        return await this.categoriesService.create(body, image);
    }

    @Put(':id')
    @UseInterceptors(
        FileFieldsInterceptor(
            [{ name: 'image', maxCount: 1 }],
            {
                storage: diskStorage({
                    destination: './uploads/category',
                    filename: (req, file, cb) => {
                        const formatDate = new FormatDateImage();
                        cb(null, formatDate.generateDate(file.originalname));
                    }
                })
            }
        )
    )
    public async update(
        @Param('id') id: number,
        @Body() body,
        @UploadedFiles() files: { image?: Express.Multer.File[] }
    ) {
        const image = files?.image?.[0]?.filename;
        return await this.categoriesService.update(id, body, image);
    }

    @Delete(':id')
    public async remove(@Param('id') id: number) {
        return await this.categoriesService.remove(id);
    }

    @Get(':id/all-products')
    public async findAllProductsByCategory(@Param('id') id: number) {
        return await this.categoriesService.findAllProductsByCategory(id);
    }

}