import { CommonModule } from "@angular/common";
import { Component, inject } from "@angular/core";
import { Course } from "../../classes/Course";
import { ActivatedRoute, ParamMap, Router } from "@angular/router";
import { CoursesService } from "../services/courses.service";

@Component({
    selector: "app-course-flow",
    standalone: true,
    imports: [CommonModule],
    templateUrl: "./course-flow.component.html",
    styleUrl: "./course-flow.component.css"
})
export class CourseFlowComponent {
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
}
