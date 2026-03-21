import {
    IsString, IsNotEmpty, IsOptional, IsNumber, IsBoolean,
    IsDateString, ValidateNested, IsArray, Min, IsPositive,
    Max
} from 'class-validator';
import { Type, Transform } from 'class-transformer';
import { VariantDto } from './create-product.dto';

export class UpdateProductDto {
    @IsOptional()
    @IsString()
    id?: string;

    @IsOptional()
    @IsString()
    title?: string;

    @IsOptional()
    @IsString()
    label?: string | null;

    @IsOptional()
    @IsString()
    category?: string;

    @IsOptional()
    @IsString()
    size?: string;

    @IsOptional()
    @Transform(({ value }) => value != null && value !== '' ? Number(value) : undefined)
    @IsNumber()
    @IsPositive()
    price?: number;

    @IsOptional()
    @Transform(({ value }) => {
        if (value === '' || value === null || value === undefined) return null;
        return Number(value);
    })
    @IsNumber()
    @Min(0)
    sale_price?: number | null;

    @IsOptional()
    @Transform(({ value }) => {
        if (value === '' || value === null || value === undefined) return null;
        return Number(value);
    })
    @IsNumber()
    @Min(0)
    @Max(100)
    sale_percentage?: number | null;

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