import { Injectable, NotFoundException } from '@nestjs/common';
import { CategoryEntity } from './Entity/CategoryEntity';
import { InjectRepository } from '@nestjs/typeorm';
import { FileService } from './file.service';
import { Repository } from 'typeorm';

@Injectable()
export class CategoryService {
    constructor(
        @InjectRepository(CategoryEntity)
        private categoryRepo: Repository<CategoryEntity>,
        private readonly fileService: FileService,
    ) { }

    public async findAll() {
        try {
            return await this.categoryRepo.find({
            });
        } catch (error) {
            throw new Error('Error fetching categories');
        }
    }
    public async findOne(id: number) {
        try {
            const category = await this.categoryRepo.findOne({
                where: { id }
            });

            if (!category) {
                throw new NotFoundException('Category not found');
            }
            return category;
        } catch (error) {
            throw new NotFoundException('Category not found');
        }
    }

    public async create(body: any, image: any) {
        const category = {
            name: body.name,
            image_url: image ? `${process.env.BACKEND_URL}/categories/uploads/${image}` : undefined,
        }
        return await this.categoryRepo.save(category);
    }

    public async update(id: number, body: any, image?: string) {
        try {
            const category = await this.categoryRepo.findOne({
                where: { id }
            });

            if (!category) {
                throw new NotFoundException('Category not found');
            }

            category.name = body.name ?? category.name;

            if (image) {
                if (category.image_url) {
                    const oldFilename = category.image_url.split('/').pop();
                    this.fileService.deleteFile(oldFilename);
                }
                category.image_url = `${process.env.BACKEND_URL}/categories/uploads/${image}`;
            }

            return await this.categoryRepo.save(category);
        } catch (error) {
            throw error;
        }
    }


    public async remove(id: number) {
        try {
            const category = await this.categoryRepo.findOne({
                where: { id }
            });

            if (!category) {
                throw new NotFoundException('Category not found');
            }

            // Ekstrakto vetem filename nga URL, jo URL-n e plote
            if (category.image_url) {
                const filename = category.image_url.split('/').pop();
                this.fileService.deleteFile(filename);
            }

            await this.categoryRepo.remove(category);
            return { message: 'Category deleted successfully' };
        } catch (error) {
            throw error;
        }
    }

    public async findAllProductsByCategory(id: number) {
        try {
            const result = await this.categoryRepo.findOne({
                where: { id },
                relations: ['products', 'products.variants'],
            });

            if (!result) {
                throw new NotFoundException('Category not found');
            }

            return result.products;
        } catch (error) {
            throw new NotFoundException('Category not found');
        }
    }
}