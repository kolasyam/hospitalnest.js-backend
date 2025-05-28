// import { Injectable, UnauthorizedException } from '@nestjs/common';
// import { SupabaseService } from '../supabase/supabase.service';
// import * as jwt from 'jsonwebtoken';
// import * as bcrypt from 'bcryptjs';

// type Admin = {
//   id: string;
//   name: string;
//   email: string;
//   password: string;
// };

// @Injectable()
// export class AuthService {
//   constructor(private readonly supabaseService: SupabaseService) {}

//   async register({
//     name,
//     email,
//     password,
//   }: {
//     name: string;
//     email: string;
//     password: string;
//   }) {
//     const client = this.supabaseService.getClient();

// const {
//   data: existingUser,
//   error: existingUserError,
// }: { data: Admin | null; error: Error | null } = await client
//   .from<Admin, Admin>('admins')
//   .select()
//   .eq('email', email)
//   .single();

//     if (existingUserError && existingUserError.message !== 'No rows found') {
//       throw existingUserError;
//     }

//     if (existingUser) {
//       throw new Error('Admin already exists');
//     }

//     const hashedPassword = await bcrypt.hash(password, 10);

//     const { data, error }: { data: Admin[] | null; error: Error | null } =
//       await client
//         .from<Admin, Admin>('admins')
//         .insert([{ name, email, password: hashedPassword }])
//         .select();

//     if (error) throw error;
//     if (!data || data.length === 0) {
//       throw new Error('Failed to register admin');
//     }

//     const user: Admin = data[0];

//     return {
//       _id: user.id,
//       name: user.name,
//       email: user.email,
//       token: this.generateToken(user.id),
//     };
//   }

//   async login({ email, password }: { email: string; password: string }) {
//     const client = this.supabaseService.getClient();

//     const { data: user, error }: { data: Admin | null; error: Error | null } =
//       await client
//         .from<Admin, Admin>('admins')
//         .select()
//         .eq('email', email)
//         .single();

//     if (error || !user) {
//       throw new UnauthorizedException('Invalid credentials');
//     }

//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch) throw new UnauthorizedException('Invalid credentials');

//     return {
//       _id: user.id,
//       name: user.name,
//       email: user.email,
//       token: this.generateToken(user.id),
//     };
//   }

//   private generateToken(id: string): string {
//     const secret = process.env.JWT_SECRET;
//     if (!secret) {
//       throw new Error('JWT_SECRET is not defined in environment variables');
//     }

//     return jwt.sign({ id }, secret, {
//       expiresIn: process.env.JWT_EXPIRE || '24h',
//     });
//   }
// }
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import * as jwt from 'jsonwebtoken';
import * as bcrypt from 'bcryptjs';

type Admin = {
  id: string;
  name: string;
  email: string;
  password: string;
};

@Injectable()
export class AuthService {
  constructor(private readonly supabaseService: SupabaseService) {}

  //   async register({
  //     name,
  //     email,
  //     password,
  //   }: {
  //     name: string;
  //     email: string;
  //     password: string;
  //   }) {
  //     const client = this.supabaseService.getClient();

  //     // Check if admin already exists
  //     const { data: existingUser, error: existingUserError } = await client
  //       .from('admins')
  //       .select('*')
  //       .eq('email', email);

  //     if (existingUserError && existingUserError.message !== 'No rows found') {
  //       throw existingUserError;
  //     }

  //     if (existingUser) {
  //       throw new Error('Admin already exists');
  //     }

  //     // Hash password
  //     const hashedPassword = await bcrypt.hash(password, 10);

  //     // Insert new admin
  //     const { data, error } = await client
  //       .from('admins')
  //       .insert([{ name, email, password: hashedPassword }])
  //       .select(); // 🔧 Removed `.single()`

  //     if (error) throw error;
  //     if (!data || data.length === 0) {
  //       throw new Error('Failed to register admin');
  //     }

  //     const user = data[0] as Admin;

  //     return {
  //       _id: user.id,
  //       name: user.name,
  //       email: user.email,
  //       token: this.generateToken(user.id),
  //     };
  //   }
  async register({
    name,
    email,
    password,
  }: {
    name: string;
    email: string;
    password: string;
  }) {
    const client = this.supabaseService.getClient();

    // Check if user already exists
    const { data: existingUsers, error: existingUserError } = await client
      .from('admins')
      .select('*')
      .eq('email', email);

    if (existingUserError) throw existingUserError;
    if (existingUsers && existingUsers.length > 0) {
      throw new Error('Admin already exists');
    }

    // Insert new admin
    const hashedPassword = await bcrypt.hash(password, 10);
    const { data, error } = await client
      .from('admins')
      .insert([{ name, email, password: hashedPassword }])
      .select(); // No `.single()` or `.maybeSingle()`

    if (error) throw error;
    if (!data || data.length === 0) {
      throw new Error('Failed to register admin');
    }

    const user = data[0] as Admin;

    return {
      _id: user.id,
      name: user.name,
      email: user.email,
      token: this.generateToken({
        id: user.id,
        name: user.name,
        email: user.email,
      }),
    };
  }

  //   async login({ email, password }: { email: string; password: string }) {
  //     const client = this.supabaseService.getClient();

  //     const { data: user, error } = await client
  //       .from('admins')
  //       .select('*')
  //       .eq('email', email)
  //       .maybeSingle(); // ✅ Safer than .single()

  //     if (error || !user) {
  //       throw new UnauthorizedException('Invalid credentials');
  //     }

  //     const typedUser = user as Admin;

  //     const isMatch = await bcrypt.compare(password, typedUser.password);
  //     if (!isMatch) throw new UnauthorizedException('Invalid credentials');

  //     return {
  //       _id: typedUser.id,
  //       name: typedUser.name,
  //       email: typedUser.email,
  //       token: this.generateToken(typedUser.id),
  //     };
  //   }
  async login({ email, password }: { email: string; password: string }) {
    const client = this.supabaseService.getClient();

    const { data: users, error } = await client
      .from('admins')
      .select('*')
      .eq('email', email)
      .limit(1);

    if (error || !users || users.length === 0) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const user = users[0] as Admin;

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new UnauthorizedException('Invalid credentials');

    return {
      _id: user.id,
      name: user.name,
      email: user.email,
      token: this.generateToken({
        id: user.id,
        name: user.name,
        email: user.email,
      }),
    };
  }

  //   private generateToken(id: string): string {
  //     const secret = process.env.JWT_SECRET;
  //     if (!secret) {
  //       throw new Error('JWT_SECRET is not defined');
  //     }

  //     return jwt.sign({ id }, secret, {
  //       expiresIn: process.env.JWT_EXPIRE || '24h',
  //     });
  //   }
  private generateToken(user: {
    id: string;
    name: string;
    email: string;
  }): string {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new Error('JWT_SECRET is not defined');
    }

    return jwt.sign(
      { id: user.id, name: user.name, email: user.email },
      secret,
      { expiresIn: process.env.JWT_EXPIRE || '24h' },
    );
  }
}
