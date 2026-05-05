import {IsArray,IsNotEmpty,IsString,ArrayNotEmpty,ValidateIf,IsNumber} from 'class-validator';

import { Type } from 'class-transformer';

export class SendNewsletterDto {

    @IsNotEmpty()
    @ValidateIf(o => !Array.isArray(o.subscriberIds))
    @IsNumber()
    @Type(() => Number)
    subscriberIds: number | number[];

    @IsString()
    subject: string;

    @IsString()
    message: string;
}