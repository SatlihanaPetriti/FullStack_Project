import { Controller, Get, Post, Put, Delete, Param, Body, UseInterceptors, UploadedFiles, Res, UseGuards } from '@nestjs/common';
import { ProductsService } from './products.service';
import { FormatDateImage } from 'src/Helper/FormatDateImage';
import { AnyFilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import type { Response } from 'express';
import { AuthGuard } from '../guards/auth.guards';
import { PermissionGuard } from '../guards/permission.guards';
import { IsPublic } from '../decorators/public.decorator';
import { Roles } from '../decorators/roles.decorator';

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
@UseGuards(AuthGuard, PermissionGuard) //aplikohen per te gjitha endpoints
export class ProductsController {
    constructor(private readonly productService: ProductsService) { }

    @Get('uploads/:filename')
    @IsPublic()
    serveImage(@Param('filename') filename: string, @Res() res: Response) {
        res.sendFile(filename, { root: 'uploads' });
    }

    @Get()
    @IsPublic()
    async getAllProducts() {
        return await this.productService.getAllProducts();
    }

    @Get(':id')
    @IsPublic()
    async getProductById(@Param('id') id: string) {
        return await this.productService.getProductById(id);
    }

    //  Vetem admin
    @Post()
    @Roles('admin')
    @UseInterceptors(AnyFilesInterceptor({ storage }))
    async createProduct(
        @Body() body: CreateProductDto,
        @UploadedFiles() files: Express.Multer.File[]
    ) {
        const indexedFiles = matchFilesToVariants(files || []);
        return await this.productService.createProduct(body, { variantImages: indexedFiles });
    }

    // Vetem admin
    @Put(':id')
    @Roles('admin')
    @UseInterceptors(AnyFilesInterceptor({ storage }))
    async updateProduct(
        @Param('id') id: string,
        @Body() body: UpdateProductDto,
        @UploadedFiles() files: Express.Multer.File[]
    ) {
        const indexedFiles = matchFilesToVariants(files || []);
        return await this.productService.updateProduct(id, body, { variantImages: indexedFiles });
    }

    //Vetem admin
    @Delete(':id')
    @Roles('admin')
    async deleteProduct(@Param('id') id: string) {
        return await this.productService.deleteProduct(id);
    }
}