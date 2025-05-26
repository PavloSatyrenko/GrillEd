import { CommonModule } from "@angular/common";
import { Component, inject, OnInit } from "@angular/core";
import { ActivatedRoute, ParamMap, Router } from "@angular/router";
import { Course } from "../../classes/Course";
import { Module } from "../../classes/Module";
import { CoursesService } from "../services/courses.service";
import { Lesson } from "../../classes/Lesson";
import { Link } from "../../classes/Link";

@Component({
    selector: "app-course",
    standalone: true,
    imports: [CommonModule],
    templateUrl: "./course.component.html",
    styleUrl: "./course.component.css"
})
export class CourseComponent implements OnInit {
    courseId: string = "";

    course: Course | null = null;

    private activatedRoute: ActivatedRoute = inject(ActivatedRoute);
    private router: Router = inject(Router);
    private coursesService: CoursesService = inject(CoursesService);

    ngOnInit(): void {
        this.activatedRoute.paramMap.subscribe((params: ParamMap) => {
            this.courseId = params.get("id")!;

            this.coursesService.getCourse(this.courseId).then((course: Course) => {
                this.course = course;
                console.log(this.course)
            }).catch((error: any) => {
                console.error("Error fetching course:", error);
                this.router.navigate(["/home"]);
            });
        });
    }

    toggleModule(module: Module): void {
        module.isOpened = !module.isOpened;
    }

    getModuleLessonAmount(module: Module, type: "ARTICLE" | "VIDEO" | "TEST"): number {
        return module.lessons.filter((lesson: Lesson) => lesson.type == type).length;
    }

    getTotalLessonAmount(type?: "ARTICLE" | "VIDEO" | "TEST"): number {
        if (!type) {
            return this.course!.modules.reduce((total: number, module: Module) => {
                return total + module.lessons.length;
            }, 0);
        }

        return this.course!.modules.reduce((total: number, module: Module) => {
            return total + module.lessons.filter((lesson: Lesson) => lesson.type == type).length;
        }, 0);
    }

    getTimeString(minutes: number): string {
        const hours: number = Math.floor(minutes / 60);
        const mins: number = minutes % 60;

        if (hours > 0) {
            return `${hours} h ${mins} min`;
        }
        else {
            return `${mins} min`;
        }
    }

    enroll(): void {
        this.coursesService.enrollCourse(this.courseId);
    }
}
