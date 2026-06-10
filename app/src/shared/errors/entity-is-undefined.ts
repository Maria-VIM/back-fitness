import { UnprocessableEntityException } from '@nestjs/common';

export class EntityIsUndefined extends UnprocessableEntityException {
  constructor(entity: string) {
    super({ code: 'ENTITY_IS_UNDEFINED', message: `${entity} is undefined` });
  }
}
