// src/products/products.controller.ts
import { Controller, Get, Post, Put, Delete, Param, Body } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Controller('products')
export class ProductsController {
    constructor(private readonly productService: ProductsService) { }

    // GET all products
    @Get()
    async getAllProducts() {
        return await this.productService.getAllProducts();
    }

    // GET single product by ID
    @Get(':id')
    async getProductById(@Param('id') id: string) {
        return await this.productService.getProductById(id);
    }

    // CREATE a new product
    @Post()
    async createProduct(@Body() createProductDto: CreateProductDto) {
        return await this.productService.createProduct(createProductDto);
    }

    // UPDATE a product
    @Put(':id')
    async updateProduct(
        @Param('id') id: string,
        @Body() updateProductDto: UpdateProductDto
    ) {
        return await this.productService.updateProduct(id, updateProductDto);
    }

    // DELETE a product
    @Delete(':id')
    async deleteProduct(@Param('id') id: string) {
        return await this.productService.deleteProduct(id);
    }
}