import {
    IsOptional,
    IsString,
    IsNumber,
} from 'class-validator';
import { Transform } from 'class-transformer';

export class UpdateTaskDto {
    @IsOptional()
    @IsString()
    title?: string;

    @IsOptional()
    @IsString()
    description?: string;

    @IsOptional()
    @IsNumber({maxDecimalPlaces: 2})
    @Transform(({ value }) => parseFloat(value))
    cena?: number;

    @IsOptional()
    @IsNumber()
    @Transform(({ value }) => parseInt(value, 10))
    kategorijaId?: number;
}