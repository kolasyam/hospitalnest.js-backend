import { Module } from '@nestjs/common';
import { HospitalController } from './hospital.controller';
import { HospitalService } from './hospital.service';
import { SupabaseService } from '../supabase/supabase.service';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [AuthModule],
  controllers: [HospitalController],
  providers: [HospitalService, SupabaseService],
})
export class HospitalModule {}
