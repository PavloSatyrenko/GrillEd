import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { firstValueFrom } from "rxjs";
import { Module } from "../../classes/Module";
import { Course } from "../../classes/Course";
import { Lesson } from "../../classes/Lesson";

@Injectable({
    providedIn: "root"
})
export class CoursesService {

    private http: HttpClient = inject(HttpClient);
    private readonly api = "https://apidev.khokhotva.me/";

    getAllCourses({
        page = 1,
        pageSize = 21,
        search = "",
        categoryId = [],
        authorId = [],
        level = [],
        status = [],
        durationMin = 0,
        durationMax = 0,
        ratingMin = 0,
        ratingMax = 0,
        my = null
    }: {
        page?: number;
        pageSize?: number;
        search?: string;
        categoryId?: string[];
        authorId?: string[];
        level?: ("BEGINNER" | "INTERMEDIATE" | "EXPERT")[];
        status?: ("DRAFT" | "PUBLISHED" | "ARCHIVED")[];
        durationMin?: number;
        durationMax?: number;
        ratingMin?: number;
        ratingMax?: number;
        my?: boolean | null;
    }
    ): Promise<any> {
        let params: HttpParams = new HttpParams()
            .set("page", page)
            .set("pageSize", pageSize)
            .set("search", search);


        if (categoryId.length > 0) {
            params = params.set("categoryId[in]", categoryId.join(","));
        }

        if (authorId.length > 0) {
            params = params.set("authorId[in]", authorId.join(","));
        }

        if (level.length > 0) {
            params = params.set("level[in]", level.join(","));
        }

        if (status.length > 0) {
            params = params.set("status[in]", status.join(","));
        }

        if (durationMin > 0) {
            params = params.set("duration[min]", durationMin);
        }

        if (durationMax > 0) {
            params = params.set("duration[max]", durationMax);
        }

        if (ratingMin > 0) {
            params = params.set("rating[min]", ratingMin);
        }

        if (ratingMax > 0) {
            params = params.set("rating[max]", ratingMax);
        }

        if (my !== null) {
            params = params.set("my", my);
        }

        return firstValueFrom(this.http.get(`${this.api}v1/courses`, { params }));
    }

    createCourse(course: { name: string, about: string, categoryId: string, level: "BEGINNER" | "INTERMEDIATE" | "EXPERT" }): Promise<any> {
        return firstValueFrom(this.http.post(`${this.api}v1/courses`, course));
    }

    getCourse(courseId: string): Promise<any> {
        return firstValueFrom(this.http.get(`${this.api}v1/courses/${courseId}`));
    }

    updateCourse(courseId: string, course: { name: string, about: string, categoryId: string, level: "BEGINNER" | "INTERMEDIATE" | "EXPERT" }): Promise<any> {
        return firstValueFrom(this.http.patch(`${this.api}v1/courses/${courseId}`, course));
    }

    updateCoursePhoto(courseId: string, formData: FormData): Promise<any> {
        return firstValueFrom(this.http.patch(`${this.api}v1/courses/${courseId}/avatar`, formData));
    }

    createModule(courseId: string, moduleName: string): Promise<any> {
        return firstValueFrom(this.http.post(`${this.api}v1/courses/${courseId}/modules`, { name: moduleName }));
    }

    deleteModule(courseId: string, moduleId: string): Promise<any> {
        return firstValueFrom(this.http.delete(`${this.api}v1/courses/${courseId}/modules/${moduleId}`));
    }

    createLesson(courseId: string, moduleId: string, lesson: Lesson): Promise<any> {
        return firstValueFrom(this.http.post(`${this.api}v1/courses/${courseId}/modules/${moduleId}/lessons`, { lesson }));
    }

    getLesson(courseId: string, lessonId: string): Promise<any> {
        return firstValueFrom(this.http.get(`${this.api}v1/courses/${courseId}/lessons/${lessonId}`));
    }

    deleteLesson(courseId: string, lessonId: string): Promise<any> {
        return firstValueFrom(this.http.delete(`${this.api}v1/courses/${courseId}/lessons/${lessonId}`));
    }

    updateLesson(courseId: string, lessonId: string, lesson: Lesson): Promise<any> {
        return firstValueFrom(this.http.patch(`${this.api}v1/courses/${courseId}/lessons/${lessonId}`,
            {
                name: lesson.name,
                estimatedTime: lesson.estimatedTime,
                type: lesson.type,
                order: lesson.number
            }
        ));
    }

    uploadLessonVideo(courseId: string, lessonId: string, formData: FormData): Promise<any> {
        return firstValueFrom(this.http.patch(`${this.api}v1/courses/${courseId}/lessons/${lessonId}/video`, formData));
    }

    updateLessonArticle(courseId: string, lessonId: string, text: string): Promise<any> {
        return firstValueFrom(this.http.patch(`${this.api}v1/courses/${courseId}/lessons/${lessonId}/article`, { text }));
    }

    getLessonVideo(videoLink: string): Promise<any> {
        return fetch(videoLink);
    }

    getLessonArticle(articleLink: string): Promise<any> {
        return fetch(articleLink);
    }

    enrollCourse(courseId: string): Promise<any> {
        return firstValueFrom(this.http.post(`${this.api}v1/courses/${courseId}/enroll`, {}));
    }
}