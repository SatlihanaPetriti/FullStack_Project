import { Injectable, NotFoundException } from '@nestjs/common';
import { CategoryEntity } from './Entity/CategoryEntity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class CategoryService {
    constructor(
        @InjectRepository(CategoryEntity)
        private categoryRepo: Repository<CategoryEntity>
    ) { }

    async findAll() {
        try {
            return await this.categoryRepo.find({
            });
        } catch (error) {
            throw new Error('Error fetching categories');
        }
    }

    async create(body: any, image: any) {
        const category = {
            name: body.name,
            image_url: image ? `http://localhost:3000/categories/uploads/${image}` : undefined,
        }
        return await this.categoryRepo.save(category);
    }

    async update(id: number, body: any, image?: string) {
        try {
            const category = await this.categoryRepo.findOne({
                where: { id }
            });

            if (!category) {
                throw new NotFoundException('Category not found');
            }

            category.name = body.name ?? category.name;

            if (image) {
                category.image_url = `http://localhost:3000/categories/uploads/${image}`;
            }

            return await this.categoryRepo.save(category);
        } catch (error) {
            throw error;
        }
    }

    async remove(id: number) {
        try {
            const category = await this.categoryRepo.findOne({
                where: { id }
            });

            if (!category) {
                throw new NotFoundException('Category not found');
            }

            await this.categoryRepo.remove(category);

            return { message: 'Category deleted successfully' };
        } catch (error) {
            throw error;
        }
    }

}
