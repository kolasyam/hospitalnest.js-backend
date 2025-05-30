import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import { HospitalDto, JwtUser } from './types';
// import { SupabaseClient } from '@supabase/supabase-js';

@Injectable()
export class HospitalService {
  constructor(private readonly supabaseService: SupabaseService) {}

  // async create(data: HospitalDto, user: JwtUser): Promise<HospitalDto> {
  //   const client = this.supabaseService.getClient();

  //   const { data: existing, error: existingError } = await client
  //     .from('hospitals')
  //     .select('*')
  //     .eq('name', data.name)
  //     .eq('created_by', user.id);

  //   if (existingError) throw existingError;
  //   if (existing && existing.length > 0) {
  //     throw new Error('Hospital already exists');
  //   }

  //   const { data: created, error } = await client
  //     .from('hospitals')
  //     .insert([{ ...data, created_by: user.id }])
  //     .select();

  //   if (error) throw error;
  //   if (!created || created.length === 0) {
  //     throw new Error('Failed to create hospital');
  //   }

  //   return created[0] as HospitalDto;
  // }
  async create(data: HospitalDto, user: JwtUser): Promise<HospitalDto> {
    const client = this.supabaseService.getClient();

    const { data: existing, error: existingError } = await client
      .from('hospitals')
      .select('*')
      .eq('name', data.name)
      .eq('created_by', user.id);

    if (existingError) throw existingError;
    if (existing && existing.length > 0) {
      throw new Error('Hospital already exists');
    }

    const { data: created, error } = await client
      .from('hospitals')
      .insert([{ ...data, created_by: user.id }])
      .select();

    if (error) throw error;
    if (!created || created.length === 0) {
      throw new Error('Failed to create hospital');
    }

    return created[0] as HospitalDto;
  }

  async findAll(user: JwtUser): Promise<HospitalDto[] | { message: string }> {
    const client = this.supabaseService.getClient();

    const { data, error } = await client
      .from('hospitals')
      .select('*')
      .eq('created_by', user.id);

    if (error) throw error;

    if (!data || data.length === 0) {
      return { message: 'No Hospitals are present.' };
    }

    return data as HospitalDto[];
  }
  async findAllHospitals(): Promise<HospitalDto[] | { message: string }> {
    const client = this.supabaseService.getClient();

    const { data, error } = await client.from('hospitals').select('*');

    if (error) throw error;

    if (!data || data.length === 0) {
      return { message: 'No Hospitals are present.' };
    }

    return data as HospitalDto[];
  }

  async findOne(id: string): Promise<HospitalDto> {
    const client = this.supabaseService.getClient();

    const { data, error } = await client
      .from('hospitals')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    if (!data) throw new NotFoundException('Hospital not found');

    return data as HospitalDto;
  }
  // async update(
  //   id: string,
  //   updates: Partial<Pick<HospitalDto, 'name' | 'location'>>,
  //   user: JwtUser,
  // ): Promise<HospitalDto> {
  //   const client = this.supabaseService.getClient();

  //   const { data: existing, error: fetchError } = await client
  //     .from('hospitals')
  //     .select()
  //     .eq('id', id)
  //     .single();

  //   if (fetchError) throw fetchError;
  //   if (!existing) throw new Error('Hospital not found');
  //   if (existing.created_by !== user.id) throw new UnauthorizedException();

  //   const { data, error } = await client
  //     .from('hospitals')
  //     .update(updates)
  //     .eq('id', id)
  //     .select()
  //     .single();

  //   if (error) throw error;
  //   if (!data) throw new Error('Update failed');

  //   return data as HospitalDto;
  // }
  async update(
    id: string,
    updates: Partial<HospitalDto>,
    user: JwtUser,
  ): Promise<HospitalDto> {
    const client = this.supabaseService.getClient();

    const { data: existing, error: fetchError } = await client
      .from('hospitals')
      .select()
      .eq('id', id)
      .single();

    if (fetchError) throw fetchError;
    if (!existing) throw new Error('Hospital not found');
    if (existing.created_by !== user.id) throw new UnauthorizedException();

    const { data, error } = await client
      .from('hospitals')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    if (!data) throw new Error('Update failed');

    return data as HospitalDto;
  }

  async remove(id: string, user) {
    const client = this.supabaseService.getClient();
    const { data: existing, error: fetchError } = await client
      .from('hospitals')
      .select()
      .eq('id', id)
      .single();

    if (fetchError) throw fetchError;
    if (existing.created_by !== user.id) throw new UnauthorizedException();

    const { error } = await client.from('hospitals').delete().eq('id', id);
    if (error) throw error;
    return { message: 'Hospital deleted successfully' };
  }
}
