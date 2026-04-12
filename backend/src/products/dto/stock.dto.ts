import { IsNumber, Min } from 'class-validator';
import { Transform } from 'class-transformer';

export class CheckStockDto {

    @Transform(({ value }) => Number(value))
    @IsNumber()
    product_id: number;

    @Transform(({ value }) => Number(value))
    @IsNumber()
    @Min(1)
    quantity: number;
}