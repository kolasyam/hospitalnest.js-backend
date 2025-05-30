import { Module } from '@nestjs/common';
import { DoctorController } from './doctor.controller';
import { DoctorService } from './doctor.service';
import { SupabaseService } from 'src/supabase/supabase.service';
@Module({
  controllers: [DoctorController],
  providers: [DoctorService, SupabaseService],
  exports: [DoctorService],
})
export class DoctorModule {}
