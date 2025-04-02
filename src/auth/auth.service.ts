/**
 * Registracija, login in JWT
 * Metode za validacijo in generiranje JWT tokena
 */
import { Injectable, UnauthorizedException, Logger } from "@nestjs/common";
import { UsersService } from "../users/users.service";
import { UserRegisterDto } from "./user-register.dto";
import { User } from "../users/entity/user.entity";
import { UserLoginDto } from "./user-login.dto";
import * as bcrypt from "bcrypt";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class AuthService {
    private readonly logger = new Logger(AuthService.name);

    constructor(private readonly userService: UsersService,
        private readonly jwtService: JwtService) {}

    async register(userRegisterDto: UserRegisterDto) {
        try {
            this.logger.log('Creating new user...');
            // Create the user
            const user = await this.userService.create(userRegisterDto);
            this.logger.log('User created:', user);
            
            // Create JWT token
            const payload = {
                email: user.email,
                sub: user.id,
            };
            this.logger.log('Creating token with payload:', payload);
            const token = this.jwtService.sign(payload);
            this.logger.log('Token created:', token);

            // Return user data with token
            const response = {
                data: {
                    id: user.id,
                    username: user.username,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    email: user.email,
                    avatar: user.avatar,
                    createdAt: user.createdAt,
                    updatedAt: user.updatedAt,
                    access_token: token
                }
            };
            this.logger.log('Returning response:', response);
            return response;
        } catch (error) {
            this.logger.error('Registration error:', error);
            // If the error is a duplicate email
            if (error.code === '23505') { // PostgreSQL unique violation code
                throw new Error('Email already exists');
            }
            // If the error is a duplicate username
            if (error.code === '23505' && error.detail?.includes('username')) {
                throw new Error('Username already exists');
            }
            throw error;
        }
    }

    async validateUser(userLoginDto: UserLoginDto) {
        try {
            this.logger.log('Validating user:', userLoginDto.email);
            const user = await this.userService.findByEmail(userLoginDto.email);
            
            if (!user) {
                this.logger.warn('User not found:', userLoginDto.email);
                throw new UnauthorizedException('Bad login');
            }

            this.logger.log('User found, comparing passwords');
            const isPasswordValid = await bcrypt.compare(userLoginDto.password, user.password);
            
            if (!isPasswordValid) {
                this.logger.warn('Invalid password for user:', userLoginDto.email);
                throw new UnauthorizedException('Bad login');
            }

            this.logger.log('User validated successfully');
            return user;
        } catch (error) {
            this.logger.error('User validation error:', {
                error: error,
                message: error.message,
                stack: error.stack
            });
            throw error;
        }
    }

    async login(userLoginDto: UserLoginDto) {
        try {
            this.logger.log('Attempting login for user:', userLoginDto.email);
            const user = await this.validateUser(userLoginDto);
            this.logger.log('User validated successfully:', user.id);

            const payload = {
                email: user.email,
                sub: user.id,
            };
            this.logger.log('Creating token with payload:', payload);
            
            let token: string;
            try {
                token = this.jwtService.sign(payload);
                this.logger.log('Token created successfully');
            } catch (jwtError) {
                this.logger.error('JWT signing error:', jwtError);
                throw new Error('Failed to create authentication token');
            }

            const response = {
                access_token: token,
                user: user
            };
            this.logger.log('Login successful, returning response');
            return response;
        } catch (error) {
            this.logger.error('Login error details:', {
                error: error,
                message: error.message,
                stack: error.stack,
                name: error.name
            });
            if (error instanceof UnauthorizedException) {
                throw error;
            }
            throw new Error('Internal server error during login');
        }
    }
}
