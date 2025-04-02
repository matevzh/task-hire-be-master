import { IsString, IsNumber} from 'class-validator';

export class CreateTaskDto {
    @IsString()
    title: string;

    @IsString()
    description: string;

    @IsNumber()
    kategorijaId: number;

    @IsNumber({maxDecimalPlaces: 2})
    cena: number;
}
