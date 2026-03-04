import {
    IsString, IsNotEmpty, IsOptional, IsNumber, IsBoolean,
    IsDateString, ValidateNested, IsArray, Min, IsPositive,
    Max, ArrayNotEmpty} from 'class-validator';
import { Type } from 'class-transformer';

// percakton strukturen dhe validation of creating nje produkt

export class VariantDto {
    @IsString()
    @IsNotEmpty({ message: 'Variant ID is required' })
    id: string;           // id do te jete nje string

    @IsString()
    @IsNotEmpty({ message: 'Variant type is required' })
    type: string;         //add string type 

    @IsNumber()
    @IsPositive({ message: 'Stock must be a positive number' })
    @Min(0, { message: 'Stock cannot be negative' })
    stock: number;        // stock must be ≥ 0
}

//CreateProductDto percakton fushat qe duhen per te krijuar nje product and validations

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

    @IsNumber()
    @IsPositive({ message: 'Price must be a positive number' })
    price: number;        

    @IsOptional()
    @IsNumber()
    @Min(0, { message: 'Sale price cannot be negative' })
    sale_price?: number;  

    @IsOptional()
    @IsNumber()
    @Min(0, { message: 'Sale percentage cannot be negative' })
    @Max(100, { message: 'Sale percentage cannot exceed 100' })
    sale_percentage?: number; 

    @IsOptional()
    @IsBoolean()
    is_bundle?: boolean;  

    @IsOptional()
    @IsDateString()
    date_added?: string;  
    
    @IsArray()
    @ValidateNested({ each: true }) //each field should not be empty
    @Type(() => VariantDto)// from js object converts in VariantDTO INSTANCE
    @ArrayNotEmpty({ message: 'At least one variant is required' })
    variants: VariantDto[]; 
}