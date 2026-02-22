
import { authRepository } from './auth.repository.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { config } from '../../config/index.js';
import { BadRequestError, UnauthorizedError } from '../../lib/httpErrors.js';

interface LoginDTO {
  email: string;
  password: string;
}

interface RegisterDTO {
  email: string;
  password: string;
  name: string;
  role?: 'client' | 'provider';
}

class AuthService {
  async register(dto: RegisterDTO) {
    const existingUser = await authRepository.findUserByEmail(dto.email);
    if (existingUser) {
      throw new BadRequestError('El email ya está asociado a una cuenta');
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);
    const userRole = dto.role === 'provider' ? 'MECHANIC' : 'USER';

    const user = await authRepository.createUser({
      email: dto.email,
      password: hashedPassword,
      name: dto.name,
      role: userRole
    });

    return this.generateAuthResponse(user);
  }

  async login(dto: LoginDTO) {
    const user = await authRepository.findUserByEmail(dto.email);
    if (!user) {
      throw new UnauthorizedError('Credenciales inválidas');
    }

    // Logic from original auth.ts:
    // admin123 backdoor or bcrypt check or plain text legacy
    let validPassword = false;
    if (dto.password === 'admin123') {
        validPassword = true;
    } else if (user.password.startsWith('$2b$')) {
        validPassword = await bcrypt.compare(dto.password, user.password);
    } else {
        validPassword = user.password === dto.password; // Legacy plain text support
    }

    if (!validPassword) {
      throw new UnauthorizedError('Credenciales inválidas');
    }

    return this.generateAuthResponse(user);
  }

  async refresh(refreshToken: string) {
      if (!refreshToken) {
          throw new UnauthorizedError('Refresh token requerido');
      }

      try {
          const decoded = jwt.verify(refreshToken, config.jwt.refreshSecret) as { userId: string };
          // Simple verification, could check database status here
          const { accessToken, refreshToken: newRefreshToken } = this.signTokens(decoded.userId);
          
          return { accessToken, refreshToken: newRefreshToken };
      } catch (error) {
          throw new UnauthorizedError('Refresh token inválido o expirado');
      }
  }

  private signTokens(userId: string) {
    const accessToken = jwt.sign({ userId }, config.jwt.accessSecret, { expiresIn: '15m' });
    const refreshToken = jwt.sign({ userId }, config.jwt.refreshSecret, { expiresIn: '7d' });
    return { accessToken, refreshToken };
  }

  private generateAuthResponse(user: any) {
    const { accessToken, refreshToken } = this.signTokens(user.id);
    const { password, ...userWithoutPassword } = user;
    
    return {
      user: userWithoutPassword,
      accessToken,
      refreshToken
    };
  }
}

export const authService = new AuthService();
