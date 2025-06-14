import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import * as jwt from 'jsonwebtoken';
import { Request } from 'express';
import { IS_PUBLIC_KEY } from './public.decorator'; // adjust path as needed

interface JwtPayload {
  id: string;
  name: string;
  email: string;
}

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true; // ✅ Skip token check for public routes
    }

    const request = context.switchToHttp().getRequest<Request>();
    const authHeader = request.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException(
        'Authorization header missing or invalid',
      );
    }

    try {
      const token = authHeader.split(' ')[1];

      if (!process.env.JWT_SECRET) {
        throw new Error('JWT_SECRET not set');
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET) as JwtPayload;

      // Assign decoded user info to req.user
      (request as Request & { user: JwtPayload }).user = decoded;

      return true;
    } catch (error) {
      console.error('JWT verification failed:', error);
      throw new UnauthorizedException('Token is invalid');
    }
  }
}
