import { SetMetadata } from '@nestjs/common';

export const PUBLIC_KEY = 'isPublic';
export const PublicRoute = () => SetMetadata(PUBLIC_KEY, true);
