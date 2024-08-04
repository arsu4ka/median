import { Request } from 'express';
import { User } from '@prisma/client';

export type AuthorizedRequest = Request & { user: User };
