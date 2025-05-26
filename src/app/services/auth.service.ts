import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { User } from "../../classes/User";
import { firstValueFrom, Observable } from "rxjs";

@Injectable({
    providedIn: "root"
})
export class AuthService {
    user: User | null = null;

    private http: HttpClient = inject(HttpClient);
    private readonly api = "https://apidev.khokhotva.me/";

    async signup(user: User): Promise<any> {
        const data: {
            email: string,
            password: string,
            name: string,
            surname: string,
            role: "STUDENT" | "TEACHER"
        } = {
            email: user.email,
            password: user.password,
            name: user.name,
            surname: user.surname,
            role: user.role
        };

        const response = await firstValueFrom(this.http.post(`${this.api}v1/auth/signUp`, data));
        return response;
    }

    verifyEmail(token: string): Promise<any> {
        return firstValueFrom(this.http.post(`${this.api}v1/auth/verifyEmail/${token}`, {}));
    }

    async login(user: User): Promise<any> {
        const data: {
            email: string,
            password: string
        } = {
            email: user.email,
            password: user.password
        };

        const response = await firstValueFrom(this.http.post(`${this.api}v1/auth/login`, data));
        return response;
    }

    async me(): Promise<User> {
        return firstValueFrom(this.http.get<User>(`${this.api}v1/auth/me`))
            .then((response: User) => {
                this.user = response;
                return response;
            }).catch(error => {
                this.user = null;
                throw error;
            });
    }

    async logout(): Promise<any> {
        return firstValueFrom(this.http.post(`${this.api}v1/auth/logout`, {})).then(() => {
            this.user = null;
            return null;
        }).catch(error => {
            this.user = null;
            throw error;
        });
    }

    refreshToken(): Observable<any> {
        return this.http.get(`${this.api}v1/auth/refresh`, { withCredentials: true });
    }
}
