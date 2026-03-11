// src/products/products.controller.ts
import { Controller, Get, Post, Put, Delete, Param, Body, UseInterceptors, UploadedFiles, Res } from '@nestjs/common';
import { ProductsService } from './products.service';
import { FormatDateImage } from 'src/Helper/FormatDateImage';
import { AnyFilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import type { Response } from 'express';

const formatDateImage = new FormatDateImage(); // Create instance

const storage = diskStorage({
    destination: './uploads',
    filename: (req, file, cb) => {
        const newFilename = formatDateImage.generateDate(file.originalname);
        cb(null, newFilename);
    }
});

function matchFilesToVariants(files: Express.Multer.File[]) {
    const result: Express.Multer.File[] = [];  // 👈 Specifiko tipin

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
        @Body() body: any,
        @UploadedFiles() files: Express.Multer.File[]
    ) {
     
        let productData = body;
    

     
        const indexedFiles = matchFilesToVariants(files || []);

        // Thirr service
        return await this.productService.createProduct(
            productData,
            { variantImages: indexedFiles }
        );
    }
    @Put(':id')
    @UseInterceptors(AnyFilesInterceptor({ storage }))
    async updateProduct(
        @Param('id') id: string,
        @Body() body: any,
        @UploadedFiles() files: Express.Multer.File[]
    ) {
        let productData = body;
        if (body.data) {
            productData = JSON.parse(body.data);
        }

        if (productData.variants) {
            productData.variants = productData.variants.map((variant: any) => ({
                ...variant,
                image: variant.image || variant.image || null
            }));
        }

       
        const indexedFiles = matchFilesToVariants(files || []);

        return await this.productService.updateProduct(id, productData, { variantImages: indexedFiles as any });
    }

    @Delete(':id')
    async deleteProduct(@Param('id') id: string) {
        return await this.productService.deleteProduct(id);
    }
}