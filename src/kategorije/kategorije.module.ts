import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { KategorijeController } from './kategorije.controller';
import { KategorijeService } from './kategorije.service';
import { Kategorija } from './entities/kategorija';

@Module({
    imports: [TypeOrmModule.forFeature([Kategorija])],
    controllers: [KategorijeController],
    providers: [KategorijeService],
    exports: [KategorijeService]
})
export class KategorijeModule {}
