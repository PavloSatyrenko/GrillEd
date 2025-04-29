import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';

export const canActivateGuard: CanActivateFn = (route, state) => {
    const authService = inject(AuthService);
    const router = inject(Router);

    const user = localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")!) : null;

    if (!user) {
        router.navigate(["/main"]);
        return false;
    }
    else {
        return true;
    }
};
