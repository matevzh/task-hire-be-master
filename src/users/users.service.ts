import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entity/user.entity';
import { UserRegisterDto } from '../auth/user-register.dto';

@Injectable()
export class UsersService {
    constructor(@InjectRepository(User) private readonly userRepository: Repository<User>) {}

    async create(user: UserRegisterDto): Promise<User> {
        const newUser = this.userRepository.create(user);
        return await this.userRepository.save(newUser);
    }

    async findByEmail(email: string): Promise<User | null> {
        return await this.userRepository.findOne({ where: { email } });
    }

    async findById(id: number): Promise<User> {
        if (!id) {
            throw new NotFoundException('User ID is required');
        }

        const user = await this.userRepository.findOne({
            where: { id },
            relations: ['tasks', 'tasks.kategorija']
        });

        if (!user) {
            throw new NotFoundException(`User with ID ${id} not found`);
        }

        return user;
    }
}


