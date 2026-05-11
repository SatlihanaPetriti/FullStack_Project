import { IsNotEmpty, IsString, ValidateIf, IsNumber, IsArray, ArrayNotEmpty } from 'class-validator';

import { Type } from 'class-transformer';

export class SendNewsletterDto {

    @IsNotEmpty()
    @ValidateIf(o => !Array.isArray(o.subscriberIds))
    @IsNumber()
    @Type(() => Number)
    @ValidateIf(o => Array.isArray(o.subscriberIds))
    @IsArray()
    @ArrayNotEmpty()
    @IsNumber({}, { each: true })  
    subscriberIds: number | number[];

    @IsString()
    subject: string;

    @IsString()
    message: string;
}