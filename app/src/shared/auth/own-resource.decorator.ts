import { SetMetadata } from '@nestjs/common';

export const OWNED_RESOURCE_KEY = 'ownedResource';
export const OwnedResource = () => SetMetadata(OWNED_RESOURCE_KEY, true);
