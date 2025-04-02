import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Task } from './entities/task';
import { TasksService } from './tasks.service';
import { TasksController } from './tasks.controller';
import { UsersModule } from 'src/users/users.module';
import { KategorijeModule } from 'src/kategorije/kategorije.module';
@Module({
    imports: [TypeOrmModule.forFeature([Task]), UsersModule, KategorijeModule],
    controllers: [TasksController],
    providers: [TasksService]
})
export class TasksModule {}
