// import { Controller } from '@nestjs/common';

// @Controller('doctor')
// export class DoctorController {}
import { Controller, Post, Body, Get, UseGuards, Req } from '@nestjs/common';
// import { Doctor } from './auth.service';
import { DoctorService } from './doctor.service';
import { JwtAuthGuard } from './jwt-doctor.guard';

@Controller('api/doctor')
export class DoctorController {
  constructor(private readonly doctorService: DoctorService) {}

  @Post('register')
  register(@Body() body) {
    return this.doctorService.register(body);
  }

  @Post('login')
  login(@Body() body) {
    return this.doctorService.login(body);
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  getProfile(@Req() req) {
    const user = (
      req as Request & { user: { id: string; name: string; email: string } }
    ).user;
    return user;
  }
}
