import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';
import { User } from '../../classes/User';

export const canActivateGuard: CanActivateFn = async (route, state) => {
    const authService: AuthService = inject(AuthService);
    const router: Router = inject(Router);

    let user: User | null = authService.user;

    if (!user) {
        await authService.me();
        user = authService.user;
    }

    if (!user) {
        router.navigate(["/main"]);
        return false;
    }
    else {
        return true;
    }
};
