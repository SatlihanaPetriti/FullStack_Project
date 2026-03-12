import { Controller, Get, Post, Put, Delete, Param, Body, UseInterceptors, UploadedFiles, Res } from '@nestjs/common';
import { ProductsService } from './products.service';
import { FormatDateImage } from 'src/Helper/FormatDateImage';
import { AnyFilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import type { Response } from 'express';

const formatDateImage = new FormatDateImage();

const storage = diskStorage({
    destination: './uploads',
    filename: (req, file, cb) => {
        cb(null, formatDateImage.generateDate(file.originalname));
    }
});

function matchFilesToVariants(files: Express.Multer.File[]): Express.Multer.File[] {
    const result: Express.Multer.File[] = [];
    for (const file of files) {
        const index = parseInt(file.fieldname.replace('variantImage_', ''));
        result[index] = file;
    }
    return result;
}

@Controller('products')
export class ProductsController {
    constructor(private readonly productService: ProductsService) { }

    @Get('uploads/:filename')
    serveImage(@Param('filename') filename: string, @Res() res: Response) {
        res.sendFile(filename, { root: 'uploads' });
    }

    @Get()
    async getAllProducts() {
        return await this.productService.getAllProducts();
    }

    @Get(':id')
    async getProductById(@Param('id') id: string) {
        return await this.productService.getProductById(id);
    }

    @Post()
    @UseInterceptors(AnyFilesInterceptor({ storage }))
    async createProduct(
        @Body() body: CreateProductDto,
        @UploadedFiles() files: Express.Multer.File[]
    ) {
        const indexedFiles = matchFilesToVariants(files || []);
        return await this.productService.createProduct(body, { variantImages: indexedFiles });
    }

    @Put(':id')
    @UseInterceptors(AnyFilesInterceptor({ storage }))
    async updateProduct(
        @Param('id') id: string,
        @Body() body: UpdateProductDto,
        @UploadedFiles() files: Express.Multer.File[]
    ) {
        const indexedFiles = matchFilesToVariants(files || []);
        return await this.productService.updateProduct(id, body, { variantImages: indexedFiles });
    }

    @Delete(':id')
    async deleteProduct(@Param('id') id: string) {
        return await this.productService.deleteProduct(id);
    }
}