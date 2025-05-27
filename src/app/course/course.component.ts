import { CommonModule } from "@angular/common";
import { Component, inject, OnInit } from "@angular/core";
import { ActivatedRoute, ParamMap, Router, RouterLink } from "@angular/router";
import { Course } from "../../classes/Course";
import { Module } from "../../classes/Module";
import { CoursesService } from "../services/courses.service";
import { Lesson } from "../../classes/Lesson";
import { User } from "../../classes/User";
import { AuthService } from "../services/auth.service";

@Component({
    selector: "app-course",
    standalone: true,
    imports: [CommonModule, RouterLink],
    templateUrl: "./course.component.html",
    styleUrl: "./course.component.css"
})
export class CourseComponent implements OnInit {
    courseId: string = "";

    user: User | null = null;

    course: Course | null = null;

    private activatedRoute: ActivatedRoute = inject(ActivatedRoute);
    private router: Router = inject(Router);
    private coursesService: CoursesService = inject(CoursesService);
    private authService: AuthService = inject(AuthService);

    ngOnInit(): void {
        this.activatedRoute.paramMap.subscribe((params: ParamMap) => {
            this.courseId = params.get("id")!;

            this.coursesService.getCourse(this.courseId).then((course: Course) => {
                this.course = course;
                this.user = this.authService.user;
            }).catch((error: any) => {
                console.error("Error fetching course:", error);
                this.router.navigate(["/home"]);
            });
        });
    }

    toggleModule(module: Module): void {
        module.isOpened = !module.isOpened;
    }

    getLevelString(level: "BEGINNER" | "INTERMEDIATE" | "EXPERT" | undefined): string {
        if (!level) {
            return "Unknown";
        }

        return level.charAt(0).toUpperCase() + level.slice(1).toLowerCase();
    }

    getStatusString(status: "PUBLISHED" | "DRAFT" | "ARCHIVED" | undefined): string {
        if (!status) {
            return "Unknown";
        }

        return status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
    }


    getModuleLessonAmount(module: Module, type: "ARTICLE" | "VIDEO" | "TEST"): number {
        return module.lessons.filter((lesson: Lesson) => lesson.type == type).length;
    }

    getTotalLessonAmount(type?: "ARTICLE" | "VIDEO" | "TEST"): number {
        if (!this.isModulesLoaded(this.course?.modules)) {
            return 0;
        }

        if (!type) {
            return this.course!.modules.reduce((total: number, module: Module) => {
                return total + module.lessons.length;
            }, 0);
        }

        return this.course!.modules.reduce((total: number, module: Module) => {
            return total + module.lessons.filter((lesson: Lesson) => lesson.type == type).length;
        }, 0);
    }

    getTimeString(minutes: number | undefined): string {
        if (minutes === undefined || minutes < 0) {
            return "Unknown";
        }

        const hours: number = Math.floor(minutes / 60);
        const mins: number = minutes % 60;

        if (hours > 0) {
            return `${hours} h ${mins} min`;
        }
        else {
            return `${mins} min`;
        }
    }

    isModulesLoaded(modules: Module[] | undefined): boolean {
        return !!modules && Array.isArray(modules) && modules.length > 0;
    }

    isCourseEditButtonVisible(): boolean {
        return this.user?.id === this.course?.author.id;
    }

    isCoursePublishButtonVisible(): boolean {
        return this.isCourseEditButtonVisible() && this.course?.status === "DRAFT";
    }

    enroll(): void {
        this.coursesService.enrollCourse(this.courseId).then(() => this.router.navigate(["/course", this.courseId, "flow"]));
    }

    publishCourse(): void {
        this.coursesService.publsihCourse(this.course!.id).then(() => this.course!.status = "PUBLISHED");
    }
}
