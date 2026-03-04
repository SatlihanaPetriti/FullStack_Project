import { PartialType } from '@nestjs/mapped-types';
import { CreateProductDto } from './create-product.dto';
// UpdateProductDto for updating a product
//me PartialType(CreateProductDto) te gjitha fushat will be optional
//na duhet kur duam te update just some field
// nese a field is provided, class-validator validates it sipas rules ne CreateProductDto
export class UpdateProductDto extends PartialType(CreateProductDto) { }