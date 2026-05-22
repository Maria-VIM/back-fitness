import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';

@Injectable()
export class SessionGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const path = request.route?.path || request.path;
    if (path === '/auth/login' && request.method === 'POST') {
      return true;
    }
    if (request.session && request.session.user) {
      return true;
    } else {
      throw new UnauthorizedException('Unauthorized');
    }
  }
}
