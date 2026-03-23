import { SetMetadata } from '@nestjs/common';
//emri i metadates is public
export const IS_PUBLIC_KEY = 'isPublic';
export const IsPublic = () => SetMetadata(IS_PUBLIC_KEY, true);