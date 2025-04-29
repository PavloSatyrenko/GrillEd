import { HttpInterceptorFn, HttpRequest, HttpHandlerFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, switchMap, throwError } from 'rxjs';
import { AuthService } from './auth.service';

export const authInterceptor: HttpInterceptorFn = (request: HttpRequest<any>, next: HttpHandlerFn) => {
    const authService: AuthService = inject(AuthService);
    const requestWithCredentials: HttpRequest<any> = request.clone({ withCredentials: true });

    return next(requestWithCredentials).pipe(
        catchError((error: HttpErrorResponse) => {
            if (error.status == 401) {
                return authService.refreshToken().pipe(
                    switchMap(() => next(requestWithCredentials))
                );
            }
            return throwError(() => error);
        })
    );
};