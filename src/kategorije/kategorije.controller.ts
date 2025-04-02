import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Patch,
    Post,
} from '@nestjs/common';
import { KategorijeService } from './kategorije.service'; 
import { Kategorija } from './entities/kategorija';

@Controller('kategorije')
export class KategorijeController {
    constructor(private readonly kategorijaService: KategorijeService) {}

    @Get()
    async findAll(): Promise<Kategorija[]> {
        return this.kategorijaService.findAll();
    }

    @Post()
    async create(@Body('title') title: string): Promise<Kategorija> {
        return this.kategorijaService.create(title);
    }

    @Patch(':id')
    async update(
        @Param('id') id: string,
        @Body('title') title: string,
    ): Promise<Kategorija> {
        return this.kategorijaService.update(+id, title);
    }

    @Delete(':id')
    async delete(@Param('id') id: string): Promise<void> {
        return this.kategorijaService.delete(+id);
    }
}