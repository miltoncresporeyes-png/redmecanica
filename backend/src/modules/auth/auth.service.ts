import { authRepository } from "./auth.repository.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "node:crypto";
import { config } from "../../config/index.js";
import {
  BadRequestError,
  ForbiddenError,
  UnauthorizedError,
} from "../../lib/httpErrors.js";
import {
  decryptVerificationCode,
  encryptVerificationCode,
  sendVerificationCodeEmail,
} from "../../services/email.js";

interface LoginDTO {
  email: string;
  password: string;
}

interface RegisterDTO {
  email: string;
  password: string;
  name: string;
  role?: "client" | "provider";
}

interface VerifyEmailDTO {
  email: string;
  verificationCode: string;
}

class AuthService {
  async register(dto: RegisterDTO) {
    const existingUser = await authRepository.findUserByEmail(dto.email);
    if (existingUser) {
      throw new BadRequestError("El email ya está asociado a una cuenta");
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);
    const userRole = dto.role === "provider" ? "MECHANIC" : "USER";
    const verificationCode = crypto.randomInt(100000, 999999).toString();
    const verificationToken = encryptVerificationCode(verificationCode);
    const verificationExpiresAt = new Date(Date.now() + 10 * 60 * 1000);

    const user = await authRepository.createUser({
      email: dto.email,
      password: hashedPassword,
      name: dto.name,
      role: userRole,
      emailVerified: false,
      emailVerificationToken: verificationToken,
      emailVerificationExpiresAt: verificationExpiresAt,
    });

    await sendVerificationCodeEmail(
      user.email,
      user.name || "usuario",
      verificationToken,
    );

    const { password, ...userWithoutPassword } = user;

    return {
      user: userWithoutPassword,
      requiresEmailVerification: true,
      verificationExpiresAt,
      message: "Se envió un código de seguridad al correo registrado",
    };
  }

  async login(dto: LoginDTO) {
    const user = await authRepository.findUserByEmail(dto.email);
    if (!user) {
      throw new UnauthorizedError("Credenciales inválidas");
    }

    if (!user.emailVerified) {
      throw new ForbiddenError(
        "Debes verificar tu correo electrónico antes de iniciar sesión",
      );
    }

    let validPassword = false;
    if (user.password.startsWith("$2b$")) {
      validPassword = await bcrypt.compare(dto.password, user.password);
    } else {
      validPassword = user.password === dto.password;
    }

    if (!validPassword) {
      throw new UnauthorizedError("Credenciales inválidas");
    }

    return this.generateAuthResponse(user);
  }

  async refresh(refreshToken: string) {
    if (!refreshToken) {
      throw new UnauthorizedError("Refresh token requerido");
    }

    try {
      const decoded = jwt.verify(refreshToken, config.jwt.refreshSecret) as {
        userId: string;
      };
      // Simple verification, could check database status here
      const { accessToken, refreshToken: newRefreshToken } = this.signTokens(
        decoded.userId,
      );

      return { accessToken, refreshToken: newRefreshToken };
    } catch (error) {
      throw new UnauthorizedError("Refresh token inválido o expirado");
    }
  }

  async verifyEmail(dto: VerifyEmailDTO) {
    const user = await authRepository.findUserByEmail(dto.email);

    if (!user) {
      throw new BadRequestError("No se encontró una cuenta para ese correo");
    }

    if (user.emailVerified) {
      return this.generateAuthResponse(user);
    }

    if (!user.emailVerificationToken || !user.emailVerificationExpiresAt) {
      throw new BadRequestError(
        "No hay un código de verificación activo para esta cuenta",
      );
    }

    if (user.emailVerificationExpiresAt.getTime() < Date.now()) {
      throw new ForbiddenError(
        "Tu código de seguridad expiró. Solicita uno nuevo",
      );
    }

    let expectedCode: string;
    let providedCode: string;

    try {
      expectedCode = decryptVerificationCode(user.emailVerificationToken);
      providedCode = decryptVerificationCode(dto.verificationCode);
    } catch (error) {
      throw new BadRequestError("Código de seguridad inválido");
    }

    if (
      expectedCode.length !== providedCode.length ||
      !crypto.timingSafeEqual(
        Buffer.from(expectedCode),
        Buffer.from(providedCode),
      )
    ) {
      throw new UnauthorizedError("Código de seguridad incorrecto");
    }

    const updatedUser = await authRepository.updateVerificationState(
      user.email,
      {
        emailVerified: true,
        emailVerificationToken: null,
        emailVerificationExpiresAt: null,
        emailVerifiedAt: new Date(),
      },
    );

    return this.generateAuthResponse(updatedUser);
  }

  async resendVerificationCode(email: string) {
    const user = await authRepository.findUserByEmail(email);

    if (!user) {
      throw new BadRequestError("No se encontró una cuenta para ese correo");
    }

    if (user.emailVerified) {
      return { message: "El correo ya está verificado" };
    }

    const verificationToken = encryptVerificationCode(
      crypto.randomInt(100000, 999999).toString(),
    );
    const verificationExpiresAt = new Date(Date.now() + 10 * 60 * 1000);

    await authRepository.updateVerificationState(user.email, {
      emailVerificationToken: verificationToken,
      emailVerificationExpiresAt: verificationExpiresAt,
    });

    await sendVerificationCodeEmail(
      user.email,
      user.name || "usuario",
      verificationToken,
    );

    return {
      message: "Se reenvió un nuevo código de seguridad al correo registrado",
      verificationExpiresAt,
    };
  }

  private signTokens(userId: string) {
    const accessToken = jwt.sign({ userId }, config.jwt.accessSecret, {
      expiresIn: "15m",
    });
    const refreshToken = jwt.sign({ userId }, config.jwt.refreshSecret, {
      expiresIn: "7d",
    });
    return { accessToken, refreshToken };
  }

  private generateAuthResponse(user: any) {
    const { accessToken, refreshToken } = this.signTokens(user.id);
    const { password, ...userWithoutPassword } = user;

    return {
      user: userWithoutPassword,
      accessToken,
      refreshToken,
    };
  }
}

export const authService = new AuthService();
