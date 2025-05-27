import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { firstValueFrom } from "rxjs";

@Injectable({
    providedIn: "root"
})
export class ProfileService {
    private http: HttpClient = inject(HttpClient);
    private readonly api = "https://apidev.khokhotva.me/";

    updateUserProfile(newData: { name: string, surname: string }): Promise<any> {
        return firstValueFrom(this.http.patch(`${this.api}v1/users/me`, newData));
    }

    updateUserPhoto(formData: FormData): Promise<any> {
        return firstValueFrom(this.http.patch(`${this.api}v1/users/me/avatar`, formData));
    }

    updateTeacherProfile(newData: { workplace: string, position: string, aboutMe: string }): Promise<any> {
        return firstValueFrom(this.http.patch(`${this.api}v1/teachers/me`, newData));
    }
}
