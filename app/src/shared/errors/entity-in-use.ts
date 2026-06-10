import { UnprocessableEntityException } from '@nestjs/common';

export class EntityInUse extends UnprocessableEntityException {
  constructor(entity: string) {
    super({
      code: 'ENTITY_IN_USE',
      message: `Entity '${entity}' in use`,
    });
  }
}
