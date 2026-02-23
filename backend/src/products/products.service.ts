// src/products/products.service.ts
import { Injectable, HttpException, HttpStatus, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './Entity/product.entity';
import { ProductVariant } from './Entity/product-variant.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductsService {
    constructor(
        @InjectRepository(Product)
        private readonly productRepository: Repository<Product>,

        @InjectRepository(ProductVariant)
        private readonly variantRepository: Repository<ProductVariant>,
    ) { }

    // GET all products
    async getAllProducts() {
        try {
            const products = await this.productRepository.find({});
            return products;
        } catch (error) {
            console.error('----Get products:', error);
            throw new HttpException('Could not fetch products', HttpStatus.INTERNAL_SERVER_ERROR,);
        }
    }

    // GET single product by ID
    async getProductById(id: string) {
        const product = await this.productRepository.findOne({ where: { id } });
        if (!product) {
            throw new NotFoundException(`Product with ID ${id} not found`);
        }
        return product;
    }

    // CREATE a new product
    async createProduct(createProductDto: CreateProductDto) {
        try {
            // check-ojme nese id eshte e dublicate
            const existingProduct = await this.productRepository.findOne({
                where: { id: createProductDto.id }
            });
            if (existingProduct) {
                throw new HttpException(`Product with ID ${createProductDto.id} already exists`, HttpStatus.BAD_REQUEST);
            }
            return await this.productRepository.save(createProductDto);
        } catch (error) {
            console.error('Create product error:', error);
            throw error;
        }
    }

    // UPDATE a product
    async updateProduct(id: string, updateProductDto: UpdateProductDto) {
        try {
            // Check if product exists with variants 
            const product = await this.productRepository.findOne({ where: { id }, relations: ['variants'] });
            if (!product) {
                throw new NotFoundException(`Product with ID ${id} not found`);
            }
            console.log('Found product:', product.id);
            // Separate variants from product data
            const { variants, ...productData } = updateProductDto;

            // Update product fields
            if (Object.keys(productData).length > 0) {
                // console.log('Updating product data:', productData);
                await this.productRepository.update(id, productData);
            }

            // Handle variants if provided
            if (variants && variants.length > 0) {
                // console.log('Updating variants:', variants);

                // Delete existing variants
                if (product.variants && product.variants.length > 0) {
                    await this.variantRepository.delete({ product: { id } });
                    // console.log('Deleted old variants');
                }

                // Create new variants
                for (const v of variants) {
                    // Just save the plain object - TypeORM handles it!
                    await this.variantRepository.save({
                        id: v.id,
                        type: v.type,
                        stock: v.stock,
                        product: { id }
                    });
                }
            }

            // Return the updated product
            const updatedProduct = await this.productRepository.findOne({
                where: { id },
                relations: ['variants']
            });

            // console.log('Product updated successfully');
            return updatedProduct;

        } catch (error) {
            // console.error('Update product error:', error);
            if (error instanceof NotFoundException) {
                throw error;
            }
            throw new HttpException(
                `Could not update product with ID ${id}: ${error.message}`,
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    // DELETE a product
    async deleteProduct(id: string) {
        try {
            // Check nese ekziston id
            const product = await this.productRepository.findOne({ where: { id } });
            if (!product) {
                throw new NotFoundException(`Product with ID ${id} not found`);
            }
            // Delete the product (automatically cuz of CASCADE)
            await this.productRepository.delete(id);
            return {
                statusCode: 200,
                message: `Product with ID ${id} deleted successfully`
            };
        } catch (error) {
            console.error('Delete product error:', error);
            if (error instanceof NotFoundException) {
                throw error;
            }
            throw new HttpException(
                `Could not delete product with ID ${id}`,
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }
}