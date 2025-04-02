import { BeforeInsert, Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import * as bcrypt from "bcrypt";
import { Task } from "src/tasks/entities/task";

@Entity('users')
export class User {
    @PrimaryGeneratedColumn()
    id: number;
    @Column({ unique: true })
    email: string;
    @Column()
    password: string;
    @Column()
    username: string;
    @Column()
    firstName: string;
    @Column()
    lastName: string;
    @Column({nullable: true})
    avatar?: string;
    @CreateDateColumn()
    createdAt: Date;
    @UpdateDateColumn()
    updatedAt: Date;
    
    @OneToMany(() => Task, (task) => task.user)
    tasks: Task[];

    @BeforeInsert()
    async hashPassword() {
        this.password = await bcrypt.hash(this.password, 10);
    }
}