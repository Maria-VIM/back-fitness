import { Body, Controller, Get, Post, Req, UnauthorizedException, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
  constructor() {}
  @UseGuards(AuthGuard('local'))
  @Post('login')
  login(@Req() req: any) {
    req.session.user = req.user;
    return {
      message: 'Login successful',
      user: req.user,
    };
  }

  @Post('logout')
  logout(@Req() req: any) {
    req.session.destroy((err: any) => {
      if (err) {
        throw new Error('Error with logout');
      }
      return { message: 'Logout successful' };
    });
  }

  @Get('user')
  @UseGuards(AuthGuard('session'))
  getCurrentUser(@Req() req: any) {
    if (req.session.user) {
      return req.session.user;
    } else {
      throw new UnauthorizedException('Unauthorized');
    }
  }
}
