import { Task } from 'src/tasks/entities/task';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Expose, Exclude } from 'class-transformer';

@Entity('kategorije')
export class Kategorija {
    @PrimaryGeneratedColumn()
    @Expose()
    id: number;
    @Column()
    @Expose()
    title: string;

    @OneToMany(() => Task, (task) => task.kategorija)
    @Exclude()
    tasks: Task[];
}