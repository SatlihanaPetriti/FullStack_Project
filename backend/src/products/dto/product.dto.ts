import {
    IsString, IsNotEmpty, IsOptional, IsNumber, IsBoolean,
    IsDateString, ValidateNested, IsArray, Min, IsPositive, Max
} from 'class-validator';
import { Type, Transform } from 'class-transformer';

export class VariantDto {
    @IsOptional()
    @Transform(({ value }) => value != null ? Number(value) : undefined)
    @IsNumber()
    id?: number;

    @IsString()
    @IsNotEmpty()
    type: string;

    @Transform(({ value }) => Number(value))
    @IsNumber()
    @Min(0)
    stock: number;

    @IsOptional()
    @IsString()
    image?: string;
}

export class ProductDto {
    @IsOptional()
    @IsString()
    title?: string;

    @IsOptional()
    @IsString()
    label?: string;

    @Transform(({ value }) => Number(value))
    @IsNumber()
    category_id: number;

    @IsOptional()
    @IsString()
    size?: string;

    @IsOptional()
    @Transform(({ value }) => Number(value))
    @IsNumber()
    @IsPositive()
    price?: number;

    @IsOptional()
    @Transform(({ value }) => value === '' || value == null ? null : Number(value))
    @IsNumber()
    @Min(0)
    sale_price?: number;

    @IsOptional()
    @Transform(({ value }) => value === '' || value == null ? null : Number(value))
    @IsNumber()
    @Min(0)
    @Max(100)
    sale_percentage?: number;

    @IsOptional()
    @Transform(({ value }) => value === 'true' || value === true)
    @IsBoolean()
    is_bundle?: boolean;

    @IsOptional()
    @IsDateString()
    date_added?: string;

    @IsOptional()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => VariantDto)
    variants?: VariantDto[];
}