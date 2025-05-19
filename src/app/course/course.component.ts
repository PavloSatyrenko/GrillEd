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
                level: "BEGINNER",
                status: "PUBLISHED",
                name: "Sample Course",
                about: "This is a sample course description.",
                estimatedTime: 10,
                rating: 4.5,
                enrolledCount: 100,
                modules: [{
                    id: "1",
                    name: "Module 1",
                    number: 1,
                    estimatedTime: 5,
                    lessons: [{
                        id: "1",
                        name: "Lesson 1",
                        number: 1,
                        type: "VIDEO",
                        estimatedTime: 2
                    }, {
                        id: "2",
                        name: "Lesson 2",
                        number: 2,
                        type: "ARTICLE",
                        estimatedTime: 3
                    }]
                }, {
                    id: "2",
                    name: "Module 2",
                    number: 2,
                    estimatedTime: 20,
                    lessons: [{
                        id: "1",
                        name: "Lesson 1",
                        number: 1,
                        type: "VIDEO",
                        estimatedTime: 2
                    }, {
                        id: "2",
                        name: "Lesson 2",
                        number: 2,
                        type: "ARTICLE",
                        estimatedTime: 3
                    }]
                }, {
                    id: "3",
                    name: "Module 3",
                    number: 3,
                    estimatedTime: 20,
                    lessons: [{
                        id: "1",
                        name: "Lesson 1",
                        number: 1,
                        type: "VIDEO",
                        estimatedTime: 2
                    }, {
                        id: "2",
                        name: "Lesson 2",
                        number: 2,
                        type: "ARTICLE",
                        estimatedTime: 3
                    }]
                }, {
                    id: "4",
                    name: "Module 4",
                    number: 4,
                    estimatedTime: 20,
                    lessons: [{
                        id: "1",
                        name: "Lesson 1",
                        number: 1,
                        type: "VIDEO",
                        estimatedTime: 2
                    }, {
                        id: "2",
                        name: "Lesson 2",
                        number: 2,
                        type: "ARTICLE",
                        estimatedTime: 3
                    }]
                }],
            };
        });
    }

    toggleModule(module: Module): void {
        module.isOpened = !module.isOpened;
    }
}
