import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { firstValueFrom } from "rxjs";

@Injectable({
    providedIn: "root"
})
export class SkillsService {

    private http: HttpClient = inject(HttpClient);
    private readonly api = "https://apidev.khokhotva.me/";

    getRootCategories(): Promise<any> {
        return firstValueFrom(this.http.get(`${this.api}v1/courseCategories`));
    }

    getCategoriesById(categoryId: string): Promise<any> {
        return firstValueFrom(this.http.get(`${this.api}v1/courseCategories/${categoryId}`));
    }

    getSkills(page: number = 1, search: string = "", pageSize: number = 20): Promise<any> {
        return firstValueFrom(this.http.get(`${this.api}v1/skills`, {
            params: { page, pageSize, search }
        }));
    }

    followSkills(skillIds: string[]): Promise<any> {
        return firstValueFrom(this.http.post(`${this.api}v1/skills/follow`, { ids: skillIds }));
    }

    unfollowSkills(skillIds: string[]): Promise<any> {
        return firstValueFrom(this.http.post(`${this.api}v1/skills/unfollow`, { ids: skillIds }));
    }

    followCategories(categoryIds: string[]): Promise<any> {
        return firstValueFrom(this.http.post(`${this.api}v1/courseCategories/follow`, { ids: categoryIds }));
    }

    unfollowCategories(categoryIds: string[]): Promise<any> {
        return firstValueFrom(this.http.post(`${this.api}v1/courseCategories/unfollow`, { ids: categoryIds }));
    }
}
