import { HttpClient, HttpHeaders } from "@angular/common/http";
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

    createCourse(course: { name: string, about: string, categoryId: string, level: "BEGINNER" | "INTERMEDIATE" | "EXPERT" }): Promise<any> {
        return firstValueFrom(this.http.post(`${this.api}v1/courses`, course));
    }

    getCourse(courseId: string): Promise<any> {
        return firstValueFrom(this.http.get(`${this.api}v1/courses/${courseId}`));
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