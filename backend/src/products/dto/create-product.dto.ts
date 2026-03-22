import {
    IsString, IsNotEmpty, IsOptional, IsNumber, IsBoolean,
    IsDateString, ValidateNested, IsArray, Min, IsPositive,
    Max, ArrayNotEmpty
} from 'class-validator';
import { Type, Transform } from 'class-transformer';

export class VariantDto {
    @IsString()
    @IsNotEmpty({ message: 'Variant ID is required' })
    id: string;

    @IsString()
    @IsNotEmpty({ message: 'Variant type is required' })
    type: string;

    @Transform(({ value }) => {
        if (value === '' || value === null || value === undefined) return undefined;
        const parsed = Number(value);
        return isNaN(parsed) ? value : parsed;
    })
    @IsNumber()
    @Min(0, { message: 'Stock cannot be negative' })
    stock: number;

    @IsOptional()
    @IsString()
    image?: string;
}

export class CreateProductDto {
    @IsString()
    @IsNotEmpty({ message: 'Product ID is required' })
    id: string;

    @IsString()
    @IsNotEmpty({ message: 'Product title is required' })
    title: string;

    @IsOptional()
    @IsString()
    label?: string;

    @IsString()
    @IsNotEmpty({ message: 'Category is required' })
    category: string;

    @IsString()
    @IsNotEmpty({ message: 'Size is required' })
    size: string;

    @Transform(({ value }) => {
        if (value === '' || value === null || value === undefined) return undefined;
        const parsed = Number(value);
        return isNaN(parsed) ? value : parsed;
    })
    @IsNumber()
    @IsPositive({ message: 'Price must be a positive number' })
    price: number;

    @IsOptional()
    @Transform(({ value }) => {
        if (value === '' || value === null || value === undefined) return undefined;
        const parsed = Number(value);
        return isNaN(parsed) ? value : parsed;
    })
    @IsNumber()
    @Min(0)
    sale_price?: number;

    @IsOptional()
    @Transform(({ value }) => {
        if (value === '' || value === null || value === undefined) return undefined;
        const parsed = Number(value);
        return isNaN(parsed) ? value : parsed;
    })
    @IsNumber()
    @Min(0)
    @Max(100)
    sale_percentage?: number;

    @IsOptional()
    @Transform(({ value }) => {
        if (value === 'true') return true;
        if (value === 'false') return false;
        return value;
    })
    @IsBoolean()
    is_bundle?: boolean;

    @IsOptional()
    @IsDateString()
    date_added?: string;

    @IsArray()
    @ArrayNotEmpty({ message: 'At least one variant is required' })
    @ValidateNested({ each: true })
    @Type(() => VariantDto)
    variants: VariantDto[];
}