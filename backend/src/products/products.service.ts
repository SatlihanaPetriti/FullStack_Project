import { Injectable, HttpException, HttpStatus, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './Entity/product.entity';
import { ProductVariant } from './Entity/product-variant.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { FileService } from '../products/file.service';
@Injectable()
export class ProductsService {
    constructor(
        @InjectRepository(Product)
        private readonly productRepository: Repository<Product>,

        @InjectRepository(ProductVariant)
        private readonly variantRepository: Repository<ProductVariant>,
        private readonly fileService: FileService,
    ) { }

    // GET all products
    public async getAllProducts() {
        try {
            return await this.productRepository.find({ relations: ['variants'] });
        } catch (error) {
            throw new HttpException('Could not fetch products', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // GET single product by ID
    public async getProductById(id: string) {
        const product = await this.productRepository.findOne({
            where: { id },
            relations: ['variants']
        });
        if (!product) throw new NotFoundException(`Product with ID ${id} not found`);
        return product;
    }

    // CREATE a product with images
    public async createProduct(createProductDto: CreateProductDto, files?: { variantImages?: Express.Multer.File[] }) {
        try {
            const existingProduct = await this.productRepository.findOne({ where: { id: createProductDto.id } });
            if (existingProduct)
                throw new HttpException(`Product ${createProductDto.id} already exists`, HttpStatus.BAD_REQUEST);

            const { variants, ...productDataWithoutVariants } = createProductDto;
            const savedProduct = await this.productRepository.save(productDataWithoutVariants);

            const variantImages = files?.variantImages || [];
            for (let i = 0; i < createProductDto.variants.length; i++) {
                const v = createProductDto.variants[i];
                const variantData: any = {
                    id: v.id,
                    type: v.type,
                    stock: v.stock,
                    product: savedProduct
                };
                if (variantImages[i]?.filename) {
                    variantData.image = variantImages[i].filename;
                }
                await this.variantRepository.save(variantData);
            }

            return await this.productRepository.findOne({
                where: { id: savedProduct.id },
                relations: ['variants']
            });

        } catch (error) {
            throw new HttpException(`Failed to create product: ${error.message}`, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }


    public async updateProduct(
        id: string,
        updateProductDto: UpdateProductDto,
        files?: { variantImages?: Express.Multer.File[] }
    ) {
        try {
            const product = await this.productRepository.findOne({
                where: { id },
                relations: ['variants'],
            });
            if (!product) throw new NotFoundException(`Product ${id} not found`);

            const { variants, ...productData } = updateProductDto;

            Object.keys(productData).forEach((key) => {
                if (productData[key] !== undefined) product[key] = productData[key];
            });
            await this.productRepository.save(product);

            const variantImages = files?.variantImages || [];

            if (variants && variants.length > 0) {
                const variantIdsFromFrontend = variants.map(v => v.id);

                const variantsToDelete = product.variants.filter(
                    v => !variantIdsFromFrontend.includes(v.id)
                );

                if (variantsToDelete.length > 0) {
                    for (const variant of variantsToDelete) {
                        if (variant.image) {
                            await this.fileService.deleteFile(variant.image);
                        }
                    }

                    const idsToDelete = variantsToDelete.map(v => v.id);
                    await this.variantRepository.delete(idsToDelete);
                }

                for (let i = 0; i < variants.length; i++) {
                    const v = variants[i];
                    const existingVariant = product.variants.find(varnt => varnt.id === v.id);

                    const variantData: any = {
                        type: v.type,
                        stock: v.stock,
                        product: { id },
                    };


                    if (variantImages[i]?.filename) {
                        if (existingVariant?.image) {
                            await this.fileService.deleteFile(existingVariant.image);
                        }
                        variantData.image = variantImages[i].filename;
                    }
                    else if (v.image === null || v.image === '') {
                        if (existingVariant?.image) {
                            await this.fileService.deleteFile(existingVariant.image);
                        }
                        variantData.image = null;
                    }
                    else if (v.image) {
                        variantData.image = v.image;
                    }

                    if (existingVariant) {
                        Object.assign(existingVariant, variantData);
                        await this.variantRepository.save(existingVariant);
                    } else {
                        await this.variantRepository.save({ id: v.id, ...variantData });
                    }
                }
            } else {
                if (product.variants && product.variants.length > 0) {
                    for (const variant of product.variants) {
                        if (variant.image) {
                            await this.fileService.deleteFile(variant.image);
                        }
                    }
                    await this.variantRepository.delete(product.variants.map(v => v.id));
                }
            }

            return await this.productRepository.findOne({
                where: { id },
                relations: ['variants'],
            });

        } catch (error) {
            console.error('Update product error:', error);
            throw new HttpException(
                `Could not update product ${id}: ${error.message}`,
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    public async deleteProduct(id: string) {
        try {
            const product = await this.productRepository.findOne({
                where: { id },
                relations: ['variants']
            });

            if (!product) throw new NotFoundException(`Product ${id} not found`);

            for (const variant of product.variants) {
                if (variant.image) {
                    await this.fileService.deleteFile(variant.image);
                }
            }

            await this.productRepository.delete(id);

            return {
                statusCode: 200,
                message: `Product ${id} and its images deleted successfully`
            };

        } catch (error) {
            throw new HttpException(
                `Could not delete product ${id}: ${error.message}`,
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }
}