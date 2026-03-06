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
    public async getAllProducts() {
        try {
            const products = await this.productRepository.find({});
            return products;
        } catch (error) {
            // console.error('----Get products:', error);
            throw new HttpException('Could not fetch products', HttpStatus.INTERNAL_SERVER_ERROR,);
        }
    }

    // GET single product by ID
    public async getProductById(id: string) {
        const product = await this.productRepository.findOne({ where: { id } });
        if (!product) {
            throw new NotFoundException(`Product with ID ${id} not found`);
        }
        return product;
    }

    // CREATE a new product
    public async createProduct(createProductDto: CreateProductDto) {
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
    public async updateProduct(id: string, updateProductDto: UpdateProductDto) {
        try {
            // Check if product exists with variants 
            const product = await this.productRepository.findOne({
                where: { id },
                relations: ['variants']
            });

            if (!product) {
                throw new NotFoundException(`Product with ID ${id} not found`);
            }

            console.log('Found product:', product.id);
            console.log('Product before update:', {
                title: product.title,
                price: product.price,
                size: product.size
            });

            // Separate variants from product data
            const { variants, ...productData } = updateProductDto;

            // ✅ STEP 1: Update the product data (title, price, size, etc.)
            if (Object.keys(productData).length > 0) {
                console.log('Updating product data:', productData);

                // Method 1: Using Object.assign
                Object.assign(product, productData);
                await this.productRepository.save(product);

                // Method 2: Using update (alternative)
                // await this.productRepository.update(id, productData);
            }

            // ✅ STEP 2: Handle variants if provided
            if (variants && variants.length > 0) {
                console.log('Updating variants:', variants);

                // Delete existing variants
                if (product.variants && product.variants.length > 0) {
                    await this.variantRepository.delete({ product: { id } });
                    console.log('Deleted old variants');
                }

                // Create new variants
                for (const v of variants) {
                    await this.variantRepository.save({
                        id: v.id,
                        type: v.type,
                        stock: v.stock,
                        product: { id }
                    });
                }
                console.log('Created new variants');
            }

            // ✅ STEP 3: Return the fully updated product
            const updatedProduct = await this.productRepository.findOne({
                where: { id },
                relations: ['variants']
            });
            return updatedProduct;
        } catch (error) {
            console.error('Update product error:', error);
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
    public async deleteProduct(id: string) {
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
            if (error instanceof NotFoundException) {
                throw error;
            }
            throw new HttpException(
                `Could not delete product with ID ${id}: ${error.message}`,
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }
}