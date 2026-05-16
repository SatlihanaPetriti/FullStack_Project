import {
    Controller, Get, Post, Put, Delete, Param, Body, UseInterceptors, UploadedFiles, Res, UseGuards
} from '@nestjs/common';
import { AnyFilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { ProductsService } from './products.service';
import { ProductDto } from './dto/product.dto';
import type { Response } from 'express';
import { FormatDateImage } from '../Helper/FormatDateImage';
import { AuthGuard } from 'src/guards/auth.guard';
import { IsPublic } from '../decorators/public.decorator';
import { Roles } from '../decorators/roles.decorator';

const formatDateImage = new FormatDateImage();
const storage = diskStorage({
    destination: './uploads/variants',
    filename: (req, file, cb) => cb(null, formatDateImage.generateDate(file.originalname)),
});

function matchFilesToVariants(files: Express.Multer.File[]): Express.Multer.File[] {
    const result: Express.Multer.File[] = [];
    for (const file of files) {
        const raw = file.fieldname.replace('variantImage_', '');
        const index = parseInt(raw, 10);
        if (!isNaN(index)) {
            result[index] = file;
        }
    }
    return result;
}

@Controller('products')
@UseGuards(AuthGuard)
export class ProductsController {
    constructor(private readonly productService: ProductsService) { }

    @Get('uploads/variants/:filename')
    @IsPublic()
    public async serveImage(@Param('filename') filename: string, @Res() res: Response) {
        res.sendFile(filename, { root: 'uploads/variants' });
    }

    @Get()
    @IsPublic()
    public async getAllProducts() {
        return this.productService.getAllProducts();
    }

    @Get(':id')
    @IsPublic()
    public async getProductById(
        @Param('id') id: number) {
        return this.productService.getProductById(id);
    }

    @Post('create')
    @Roles('admin')
    @UseInterceptors(AnyFilesInterceptor({ storage }))
    public async createProduct(
        @Body() dto: ProductDto,
        @UploadedFiles() files: Express.Multer.File[]
    ) {
        return this.productService.createProduct(dto, matchFilesToVariants(files ?? []));
    }

    @Put(':id')
    @Roles('admin')
    @UseInterceptors(AnyFilesInterceptor({ storage }))
    public async updateProduct(
        @Param('id') id: number,
        @Body() dto: ProductDto,
        @UploadedFiles() files: Express.Multer.File[]
    ) {
        return this.productService.updateProduct(id, dto, matchFilesToVariants(files ?? []));
    }

    @Put(':id/add-stock')
    @Roles('admin')
    public async addStock(
        @Param('id') id: number,
        @Body('stockToAdd') stockToAdd: number) {
        return this.productService.addStock(id, stockToAdd);
    }

    @Delete(':id')
    @Roles('admin')
    public async deleteProduct(
        @Param('id') id: number) {
        return this.productService.deleteProduct(id);
    }
}