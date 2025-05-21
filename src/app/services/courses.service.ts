import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { firstValueFrom } from "rxjs";
import { Module } from "../../classes/Module";
import { Course } from "../../classes/Course";
import { Lesson } from "../../classes/Lesson";

@Injectable({
    providedIn: "root"
})
export class CoursesService {

    constructor() { }

    private http: HttpClient = inject(HttpClient);
    private readonly api = "https://apidev.khokhotva.me/";

    createCourse(course: { name: string, about: string, categoryId: string, level: "BEGINNER" | "INTERMEDIATE" | "EXPERT" }): Promise<any> {
        return firstValueFrom(this.http.post(`${this.api}v1/courses`, course));
    }

    getCourse(courseId: string): Promise<any> {
        return firstValueFrom(this.http.get(`${this.api}v1/courses/${courseId}`));
    }

    createModule(courseId: string, moduleName: string): Promise<any> {
        return firstValueFrom(this.http.post(`${this.api}v1/courses${courseId}/modules`, { name: moduleName }));
    }

    deleteModule(courseId: string, moduleId: string): Promise<any> {
        return firstValueFrom(this.http.delete(`${this.api}v1/courses/${courseId}/modules/${moduleId}`));
    }

    createLesson(courseId: string, moduleId: string, lesson: Lesson): Promise<any> {
        return firstValueFrom(this.http.post(`${this.api}v1/courses/${courseId}/modules/${moduleId}/lessons`, { lesson }));
    }

    uploadLessonVideo(courseId: string, lessonId: string, file: File): Promise<any> {
        return firstValueFrom(this.http.post(`${this.api}v1/courses/${courseId}/lessons/${lessonId}/video`, file));
    }

    enrollCourse(courseId: string): Promise<any> {
        return firstValueFrom(this.http.post(`${this.api}v1/courses/${courseId}/enroll`, {}));
    }
}