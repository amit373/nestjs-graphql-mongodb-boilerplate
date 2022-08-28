import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';

import { UserRole } from '@app/constants';
import { AuthGuard, RolesGuard } from '../guards';

export function Auth(...roles: UserRole[]) {
    return applyDecorators(
        SetMetadata('roles', roles),
        UseGuards(AuthGuard, RolesGuard)
    );
}
