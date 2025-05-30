import {
  Controller,
  Post,
  Get,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  Req,
} from '@nestjs/common';
import { HospitalService } from './hospital.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Request } from 'express';
import { HospitalDto, JwtUser } from './types';
import { Public } from 'src/doctor/public.decorator';
// Define the structure of user payload from JWT
interface AuthenticatedRequest extends Request {
  user: JwtUser;
}

@Controller('api/hospital')
@UseGuards(JwtAuthGuard)
export class HospitalController {
  constructor(private readonly hospitalService: HospitalService) {}

  @Post()
  create(@Body() body: HospitalDto, @Req() req: AuthenticatedRequest) {
    return this.hospitalService.create(body, req.user);
  }
  @Public()
  @Get('all')
  findAllHospitals() {
    return this.hospitalService.findAllHospitals();
  }

  @Get()
  findAll(@Req() req: AuthenticatedRequest) {
    return this.hospitalService.findAll(req.user);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.hospitalService.findOne(id);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() body: HospitalDto,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.hospitalService.update(id, body, req.user);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Req() req: AuthenticatedRequest) {
    return this.hospitalService.remove(id, req.user);
  }
}
