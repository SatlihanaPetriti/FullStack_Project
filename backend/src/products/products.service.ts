import { Injectable, HttpException, HttpStatus, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './Entity/product.entity';
import { ProductVariant } from './Entity/product-variant.entity';
import { ProductDto } from './dto/product.dto';
import { FileService } from './file.service';

@Injectable()
export class ProductsService {
    constructor(
        @InjectRepository(Product)
        private readonly productRepo: Repository<Product>,
        @InjectRepository(ProductVariant)
        private readonly variantRepo: Repository<ProductVariant>,
        private readonly fileService: FileService,
    ) { }

    public async getAllProducts() {
        return this.productRepo.find({ relations: ['variants', 'category'] });
    }

    public async getProductById(id: number) {
        const product = await this.productRepo.findOne({
            where: { id },
            relations: ['variants', 'category'],
        });
        if (!product) throw new NotFoundException(`Product ${id} not found`);
        return product;
    }

    public async createProduct(dto: ProductDto, variantImages: Express.Multer.File[] = []) {
        try {
            const { variants, ...productData } = dto;
            const product = await this.productRepo.save(productData);

            if (variants) {
                for (let i = 0; i < variants.length; i++) {
                    await this.variantRepo.save({
                        type: variants[i].type,
                        stock: variants[i].stock,
                        product_id: product.id,
                        image: variantImages[i]?.filename ?? null,
                    });
                }
            }

            return this.productRepo.findOne({
                where: { id: product.id },
                relations: ['variants', 'category'],
            });
        } catch (error) {
            throw new HttpException(`Failed to create: ${(error as Error).message}`, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    public async updateProduct(id: number, dto: ProductDto, variantImages: Express.Multer.File[] = []) {
        try {
            const product = await this.getProductById(id);
            const { variants, ...productData } = dto;

            delete (product as any).category;

            Object.assign(product, {
                ...productData,
                category_id: Number(dto.category_id),
            });

            await this.productRepo.save(product);

            if (variants) {
                const incomingIds = variants
                    .filter(v => v.id)
                    .map(v => Number(v.id));

                const toDelete = product.variants.filter(
                    v => !incomingIds.includes(Number(v.id))
                );

                if (toDelete.length) {
                    this.fileService.deleteFiles(toDelete.map(v => v.image).filter(Boolean));
                    await this.variantRepo.delete(toDelete.map(v => v.id));
                }

                for (let i = 0; i < variants.length; i++) {
                    const v = variants[i];

                    const existing = product.variants.find(
                        pv => Number(pv.id) === Number(v.id)
                    );

                    const newImage = variantImages[i]?.filename;

                    if (newImage && existing?.image) {
                        this.fileService.deleteFile(existing.image);
                    }

                    let finalImage: string | undefined;
                    if (newImage) {
                        finalImage = newImage;
                    } else if (v.image) {
                        finalImage = v.image;
                    } else if (existing?.image) {
                        finalImage = existing.image;
                    } else {
                        finalImage = undefined;
                    }

                    await this.variantRepo.save({
                        ...(existing ?? {}),
                        id: v.id ? Number(v.id) : undefined,
                        type: v.type,
                        stock: v.stock,
                        product_id: id,
                        image: finalImage,
                    });
                }
            }

            return this.productRepo.findOne({
                where: { id },
                relations: ['variants', 'category'],
            });
        } catch (error) {
            throw new HttpException(`Failed to update: ${(error as Error).message}`, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    public async checkStock(productId: number, quantity: number) {
        const product = await this.productRepo.findOne({
            where: { id: productId }
        });
        if (!product) {
            throw new NotFoundException("Product not found")
        }
        if (product.stock < quantity) {
            throw new BadRequestException(
                `Only ${product.stock} items available in stock`
            );
        }
        return product;
    }

    public async checkOut(productId: number, quantity: number) {
        const product = await this.productRepo.findOne({
            where: { id: productId }
        });

        if (!product) {
            throw new NotFoundException("Product not found");
        }
        if (product.stock < quantity) {
            throw new BadRequestException(
                `Only ${product.stock} items available in stock`
            );
        }
        product.stock = product.stock - quantity;
        const updatedProduct = await this.productRepo.save(product);
        return updatedProduct;
    }

    public async deleteProduct(id: number) {
        const product = await this.getProductById(id);

        this.fileService.deleteFiles(
            product.variants.map(v => v.image).filter(Boolean)
        );

        await this.productRepo.delete(id);
        return { message: `Product ${id} deleted successfully` };
    }
}