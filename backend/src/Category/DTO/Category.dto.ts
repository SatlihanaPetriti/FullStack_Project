import { IsString, IsNotEmpty, IsOptional } from "class-validator";

export class CategoryDTO {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsOptional()
    image_url: string;
}
