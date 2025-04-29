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

        const response = await firstValueFrom(this.http.post(`${this.api}/v1/auth/signUp`, data));
        localStorage.setItem("user", JSON.stringify(this.user));
        return response;
    }

    verifyEmail(token: string): Promise<any> {
        return firstValueFrom(this.http.post(`${this.api}/v1/auth/verifyEmail${token}`, {}));
    }

    async login(user: User): Promise<any> {
        const data: {
            email: string,
            password: string
        } = {
            email: user.email,
            password: user.password
        };

        const response = await firstValueFrom(this.http.post(`${this.api}/v1/auth/login`, data));
        localStorage.setItem("user", JSON.stringify(this.user));
        return response;
    }

    refreshToken(): Observable<any> {
        return this.http.get(`${this.api}/v1/auth/refresh`);
    }
}
