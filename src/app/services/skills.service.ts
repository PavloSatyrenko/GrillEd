import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { firstValueFrom } from "rxjs";

@Injectable({
    providedIn: "root"
})
export class SkillsService {

    constructor() { }

    private http: HttpClient = inject(HttpClient);
    private readonly api = "https://apidev.khokhotva.me/";

    getRootSkills(): Promise<any> {
        return firstValueFrom(this.http.get(`${this.api}v1/courseCategories`));
    }

    getSkills(categoryId: string): Promise<any> {
        return firstValueFrom(this.http.get(`${this.api}v1/courseCategories/${categoryId}`));
    }
}
