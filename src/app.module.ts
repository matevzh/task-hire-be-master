import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './users/entity/user.entity';
import { AuthModule } from './auth/auth.module';
import { TasksController } from './tasks/tasks.controller';
import { KategorijeModule } from './kategorije/kategorije.module';
import { TasksModule } from './tasks/tasks.module';
import { Task } from './tasks/entities/task';
import { Kategorija } from './kategorije/entities/kategorija';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    // Load environment variables
    ConfigModule.forRoot(),
    
    // DB connection using environment variables
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT || '5432'),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      entities: [User, Task, Kategorija], // Entitete v bazi
      synchronize: process.env.NODE_ENV === 'development', // Only sync in development
    }),
    
    UsersModule,     
    AuthModule,      
    TasksModule,  
    KategorijeModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
