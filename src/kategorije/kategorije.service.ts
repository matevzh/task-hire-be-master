import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Kategorija } from './entities/kategorija';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class KategorijeService {
    constructor(
        @InjectRepository(Kategorija)
        private readonly kategorijaRepository: Repository<Kategorija>,
    ) {}

    async findAll(): Promise<Kategorija[]> {
        return this.kategorijaRepository.find();
    }

    async create(title: string): Promise<Kategorija> {
        const kategorija = this.kategorijaRepository.create({ title: title });
        return this.kategorijaRepository.save(kategorija);
    }

    async delete(id: number): Promise<void> {
        await this.kategorijaRepository.delete(id);
    }

    async update(id: number, title: string): Promise<Kategorija> {
        const kategorija = await this.kategorijaRepository.findOne({ where: { id: id } });
        if (!kategorija) {
            throw new NotFoundException('Category not found');
        }
        kategorija.title = title;
        return await this.kategorijaRepository.save(kategorija);
    }

    async findById(id: number): Promise<Kategorija> {
        const kategorija = await this.kategorijaRepository.findOne({ where: { id: id } });
        if (!kategorija) {
            throw new NotFoundException('Category not found');
        }
        return kategorija;
    }
}