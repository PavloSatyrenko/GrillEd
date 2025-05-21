import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';
import { User } from '../../classes/User';

export const canActivateGuard: CanActivateFn = async (route, state) => {
    const authService: AuthService = inject(AuthService);
    const router: Router = inject(Router);

    let user: User | null = authService.user;

    if (!user) {
        const result: User | null = await authService.me().catch(() => null);

        if (result) {
            user = authService.user;
        }
        else {
            router.navigate(["/main"]);
            return false;
        }
    }

    return true;
};
