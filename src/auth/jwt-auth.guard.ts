// // import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
// // import * as jwt from 'jsonwebtoken';

// // @Injectable()
// // export class JwtAuthGuard implements CanActivate {
// //   async canActivate(context: ExecutionContext): Promise<boolean> {
// //     const request = context.switchToHttp().getRequest();
// //     const authHeader = request.headers.authorization;

// //     if (!authHeader || !authHeader.startsWith('Bearer ')) return false;

// //     try {
// //       const token = authHeader.split(' ')[1];
// //       const decoded = jwt.verify(token, process.env.JWT_SECRET);
// //       request.user = decoded;
// //       return true;
// //     } catch {
// //       return false;
// //     }
// //   }
// // }
// import {
//   CanActivate,
//   ExecutionContext,
//   Injectable,
//   UnauthorizedException,
// } from '@nestjs/common';
// import * as jwt from 'jsonwebtoken';
// import { Request } from 'express';

// interface JwtPayload {
//   id: string;
//   // add other fields here if needed, e.g. email, role, etc.
// }

// @Injectable()
// export class JwtAuthGuard implements CanActivate {
//   canActivate(context: ExecutionContext): boolean {
//     const request = context.switchToHttp().getRequest<Request>();
//     const authHeader = request.headers.authorization;

//     if (!authHeader || !authHeader.startsWith('Bearer ')) {
//       throw new UnauthorizedException(
//         'Authorization header missing or invalid',
//       );
//     }

//     try {
//       const token = authHeader.split(' ')[1];

//       if (!process.env.JWT_SECRET) {
//         throw new Error('JWT_SECRET not set');
//       }

//       const decoded = jwt.verify(token, process.env.JWT_SECRET) as JwtPayload;

//       // @ts-expect-error - we'll fix this with a type declaration
//       request.user = decoded;

//       return true;
//     } catch (error) {
//       console.error('JWT verification failed:', error);
//       throw new UnauthorizedException('Token is invalid');
//     }
//   }
// }
// jwt-auth.guard.ts
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { Request } from 'express';

interface JwtPayload {
  id: string;
  name: string;
  email: string;
}

@Injectable()
export class JwtAuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
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

      // Assign decoded user info to req.user with proper type assertion
      (request as Request & { user: JwtPayload }).user = decoded;

      return true;
    } catch (error) {
      console.error('JWT verification failed:', error);
      throw new UnauthorizedException('Token is invalid');
    }
  }
}
