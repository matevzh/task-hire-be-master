import {
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';
import { User } from '../../users/entity/user.entity';  
import { Kategorija } from 'src/kategorije/entities/kategorija';
import { Expose } from 'class-transformer';

@Entity('tasks') //ime tabele
export class Task {
    @PrimaryGeneratedColumn()
    @Expose()
    id: number;
    @Column()
    @Expose()
    title: string;
    @Column()
    @Expose()
    description: string;
    @CreateDateColumn()
    @Expose()
    createdAt: Date;
    @UpdateDateColumn()
    @Expose()
    updatedAt: Date;
    @Column('decimal', { precision: 10, scale: 2 })
    @Expose()
    cena: number;

    @Column()
    @Expose()
    kategorijaId: number;

    @ManyToOne(() => User, (user) => user.tasks, { nullable: false })
    @JoinColumn({ name: 'user_id' })
    @Expose()
    user: User;

    @ManyToOne(() => Kategorija, (kategorija) => kategorija.tasks, { eager: true })
    @JoinColumn({ name: 'kategorijaId' })
    @Expose()
    kategorija: Kategorija;
}