import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './entities/task';
import { Repository } from 'typeorm';
import { CreateTaskDto } from './entities/create-task.dto';
import { UpdateTaskDto } from './entities/update-task.dto';
import { UsersService } from '../users/users.service';
import { KategorijeService } from 'src/kategorije/kategorije.service';

@Injectable()
export class TasksService {
    constructor(
        @InjectRepository(Task)
        private readonly taskRepository: Repository<Task>,
        private readonly userService: UsersService,
        private readonly kategorijaService: KategorijeService,
    ) {}

    async findAll(): Promise<Task[]> {
        const tasks = await this.taskRepository.find({
            relations: ['kategorija']
        });
            
        console.log('Tasks Service - All tasks:', JSON.stringify(tasks, null, 2));
        return tasks;
    }

    async findOne(id: number): Promise<Task> {
        console.log('Tasks Service - Finding task with ID:', id);
        const task = await this.taskRepository.findOne({
            where: { id },
            relations: ['kategorija'],
        });
        console.log('Tasks Service - Found task:', JSON.stringify(task, null, 2));
        
        if (!task) {
            throw new NotFoundException('Task not found');
        }
        return task;
    }   

    async create(createTaskDto: CreateTaskDto, userId: number, kategorijaId: number): Promise<Task> {
        const user = await this.userService.findById(userId);
        const kategorija = await this.kategorijaService.findById(kategorijaId);
        if (!user) {
            throw new NotFoundException('User not found');
        }
        const newTask = this.taskRepository.create({...createTaskDto, kategorija, user});
        return this.taskRepository.save(newTask);
    }

    async update(id: number, updateTaskDto: UpdateTaskDto): Promise<Task> {
        const task = await this.taskRepository.findOne({ where: { id: id } });
        if (!task) {
            throw new NotFoundException('Task ne obstaja');
        }
        await this.taskRepository.update(id, updateTaskDto);
        const updatedTask = await this.taskRepository.findOne({ where: { id: id } });
        if (!updatedTask) {
            throw new NotFoundException('Task not found after update');
        }
        return updatedTask;
    }

    async delete(id: number): Promise<void> {
        await this.taskRepository.delete(id);
    }

    async findByCategory(categoryId: number): Promise<Task[]> {
        console.log('Tasks Service - Finding tasks for category:', categoryId);
        
        const tasks = await this.taskRepository.find({
            relations: ['kategorija'],
            where: {
                kategorija: {
                    id: categoryId
                }
            }
        });

        console.log('Tasks Service - Found tasks:', JSON.stringify(tasks, null, 2));
        return tasks;
    }

    async findByUser(userId: number): Promise<Task[]> {
        if (!userId) {
            throw new NotFoundException('User ID is required');
        }

        console.log('Tasks Service - Finding tasks for user:', userId);
        console.log('Tasks Service - User ID type:', typeof userId);
        
        try {
            // First check if the user exists
            const userExists = await this.userService.findById(userId);
            if (!userExists) {
                console.error('Tasks Service - User not found:', userId);
                throw new NotFoundException(`User with ID ${userId} not found`);
            }
            console.log('Tasks Service - User found:', userExists.id);

            const tasks = await this.taskRepository
                .createQueryBuilder('task')
                .leftJoinAndSelect('task.kategorija', 'kategorija')
                .leftJoinAndSelect('task.user', 'user')
                .where('user.id = :userId', { userId })
                .getMany();

            console.log('Tasks Service - Query result:', {
                userId,
                tasksFound: tasks.length,
                tasks: JSON.stringify(tasks, null, 2)
            });
            return tasks;
        } catch (error) {
            console.error('Error finding tasks for user:', {
                userId,
                error: error.message,
                stack: error.stack
            });
            throw error;
        }
    }
}