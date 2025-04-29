import { CommonModule } from "@angular/common";
import { Component, inject, OnInit } from "@angular/core";
import { ActivatedRoute, ParamMap } from "@angular/router";
import { Course } from "../../classes/Course";
import { Module } from "../../classes/Module";

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

    modules!: Module[];

    private activatedRoute: ActivatedRoute = inject(ActivatedRoute);

    ngOnInit(): void {
        this.activatedRoute.paramMap.subscribe((params: ParamMap) => {
            this.courseId = params.get("id")!;

            // this.course = this.getCourseById(this.courseId);
            this.course = {
                id: this.courseId,
                author: {
                    id: "123",
                    name: "John",
                    surname: "Doe",
                    avatar: "https://via.placeholder.com/150"
                },
                category: {
                    id: "456",
                    name: "Programming"
                },
                name: "Sample Course",
                about: "This is a sample course description.",
                estimatedTime: 10,
                rating: 4.5,
                enrolledCount: 99.99,
            };

            this.modules = [{
                id: "1",
                name: "Module 1",
                order: 1,
                estimatedTime: 5
            }, {
                id: "2",
                name: "Module 2",
                order: 2,
                estimatedTime: 20
            }, {
                id: "3",
                name: "Module 3",
                order: 3,
                estimatedTime: 20
            }, {
                id: "4",
                name: "Module 4",
                order: 4,
                estimatedTime: 20
            }];
        });
    }

    toggleModule(module: Module): void {
        module.isOpened = !module.isOpened;
    }
}
