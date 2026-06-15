import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { OwnershipService } from './ownership.service';
import { OWNED_RESOURCE_KEY } from './own-resource.decorator';

interface SessionRequest {
  session: {
    user?: {
      id?: number;
    };
  };
}

@Injectable()
export class OwnsResourceGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly ownership: OwnershipService,
  ) {}

  async canActivate(ctx: ExecutionContext): Promise<boolean> {
    const meta = this.reflector.get<boolean>(OWNED_RESOURCE_KEY, ctx.getHandler());
    if (!meta) {
      return true;
    }
    const req: SessionRequest = ctx.switchToHttp().getRequest<SessionRequest>();
    const userId: number | undefined = req.session?.user?.id;
    if (!userId) {
      throw new ForbiddenException();
    }
    const isAdmin: boolean = await this.ownership.ownsAdminPermission(userId.toString());
    if (!isAdmin) {
      throw new ForbiddenException('Admin permission required');
    }
    return true;
  }
}
