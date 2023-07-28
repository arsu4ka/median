import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthEntity } from './entity/auth.entity';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
    constructor(private prisma: PrismaService, private jwtService: JwtService) {}

    async login(email: string, password: string): Promise<AuthEntity> {
        const user = await this.prisma.user.findUnique({ where: {email: email} });

        if (!user) {
            throw new NotFoundException(`No user found with email ${email}`);
        }

        const isValidPassword = user.password == password;
        if (!isValidPassword) {
            throw new UnauthorizedException("Invalid password");
        }

        const authEntity = new AuthEntity();
        authEntity.accessToken = await this.jwtService.signAsync({ userId: user.id });
        return authEntity;
    }    
}
