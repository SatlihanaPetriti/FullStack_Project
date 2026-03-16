import { Injectable, HttpException, HttpStatus, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './Entity/product.entity';
import { ProductVariant } from './Entity/product-variant.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';


@Injectable()
export class ProductsService {
    constructor(@InjectRepository(Product)private readonly productRepository: Repository<Product>,
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
    public async createProduct(
        createProductDto: CreateProductDto,
        files?: { variantImages?: Express.Multer.File[] }
    ) {
        try {
            const existing = await this.productRepository.findOne({
                where: { id: createProductDto.id }
            });
            if (existing) {
                throw new HttpException('Product exists', HttpStatus.BAD_REQUEST);
            }
            // kontrollojme imazhet
            const variantImages = files?.variantImages || [];

            // cdo variant duhet te kete imazhe
            if (variantImages.length !== createProductDto.variants.length) {
                throw new HttpException(
                    'Each variant must have an image',
                    HttpStatus.BAD_REQUEST
                );
            }
            //  bashkimi i varinteve me imazhet
            const variantsWithImages = createProductDto.variants.map((v, i) => {
                if (!variantImages[i]?.filename) {
                    throw new HttpException(
                        `Variant ${v.id} is missing an image`,
                        HttpStatus.BAD_REQUEST
                    );
                }

                return {
                    ...v, // kthehen te gjitha variantet id, stock...
                    image: variantImages[i].filename // si dhe imazhet nga file
                };
            });
            // ruhet produkti
            const savedProduct = await this.productRepository.save({
                ...createProductDto,
                variants: variantsWithImages
            });
            //variantsWithImages tani permban array e ri me productet dhe varaintet me imazhe  dhe kthehen ne front

            return savedProduct; 

        } catch (error) {
            throw new HttpException(
                `Failed: ${error.message}`,
                HttpStatus.INTERNAL_SERVER_ERROR
            );
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
            });

            if (!product) {
                throw new NotFoundException(`Product ${id} not found`);
            }
            //  productData = { price: 65, label: "SALE" }
            //Object.keys(productData) = ['price', 'label']
            // HAPI 3: forEach kalon nëpër çdo key
            // Iteracioni 1: key = 'price'
            //   productData.price = 65 !== undefined
            //   product.price = 65

            const { variants, ...productData } = updateProductDto;
            // perditesohet fushat qe vijne nga frontend
            Object.keys(productData).forEach((key) => {
                if (productData[key] !== undefined) {
                    product[key] = productData[key];
                }
            });
                //nese ka imazhe te reja i marrim ato
            const variantImages = files?.variantImages || [];
                // nese kemi variante per te perditesuar(variante shtese)
            if (variants && variants.length > 0) {
                // checkojme nese cdo variant ka nje imazh
                if (variantImages.length !== variants.length) {
                    throw new HttpException(
                        `Each variant must have an image.`,
                        HttpStatus.BAD_REQUEST
                    );
                }
                // krijohen varaintet e reja me imazhet perkatese
                const variantEntities = variants.map((v, i) => {
                    if (!variantImages[i]?.filename) {
                        throw new HttpException(
                            `Variant ${v.id} is missing an image`,
                            HttpStatus.BAD_REQUEST
                        );
                    }

                    const variant = new ProductVariant();
                    variant.id = v.id;
                    variant.type = v.type;
                    variant.stock = v.stock;
                    variant.image = variantImages[i].filename; // nese ka replace vendosim imazhin per i replacuar
                    variant.product = product; // lidhet varianti me productin
                    return variant;
                });
                // replace variantet e vjetra me te rejat
                product.variants = variantEntities;

            } else if (variants !== undefined) {
                // nese dergohen bosh kthehet errro
                throw new HttpException(
                    'Product must have at least one variant',
                    HttpStatus.BAD_REQUEST
                );
            }
                // ruhen ne database dhe kthehen ne front
            const savedProduct = await this.productRepository.save(product);
            return savedProduct;

        } catch (error) {
            throw new HttpException(error.message,error.status || HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // DELETE a product
    public async deleteProduct(id: string) {
        try {
            const result = await this.productRepository.delete(id);

            if (result.affected === 0) {
                throw new NotFoundException(`Product ${id} not found`);
            }

            return {
                statusCode: 200,
                message: `Product ${id} deleted successfully`
            };

        } catch (error) {
            if (error instanceof NotFoundException) {
                throw error;
            }
            throw new HttpException(
                `Could not delete product ${id}: ${error.message}`,
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }
}