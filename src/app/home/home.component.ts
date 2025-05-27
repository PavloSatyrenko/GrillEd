import { Component, inject, OnInit } from "@angular/core";
import { User } from "../../classes/User";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { AuthService } from "../services/auth.service";
import { Course } from "../../classes/Course";
import { RouterModule } from "@angular/router";
import { CoursesService } from "../services/courses.service";
import { SkillsService } from "../services/skills.service";
import { Skill } from "../../classes/Skill";

@Component({
    selector: "app-home",
    standalone: true,
    imports: [CommonModule, FormsModule, RouterModule],
    templateUrl: "./home.component.html",
    styleUrl: "./home.component.css"
})
export class HomeComponent implements OnInit {
    user: User | null = null;

    panelNumber: number = 3;
    filterValue: string = "";
    categoryFilters: Skill[] = [];
    skillFilters: Skill[] = [];

    startedCourses!: Course[];

    courses: Course[] = [];

    coursesByCategory: Course[] = [];
    coursesBySkills: Course[] = [];

    private authService: AuthService = inject(AuthService);
    private coursesService: CoursesService = inject(CoursesService);
    private skillsService: SkillsService = inject(SkillsService);

    ngOnInit(): void {
        this.user = this.authService.user;

        if (this.user!.role == "TEACHER") {
            this.panelNumber = 1;
        }

        if (this.user!.role == "STUDENT") {
            this.coursesService.getStudentCourses({}).then((response: { data: Course[], pagination: any }) => {
                console.log(response.data);
                this.startedCourses = response.data;
            });
        }

        this.startedCourses = [{
            id: "1",
            author: {
                id: "123",
                name: "John",
                surname: "Doe",
                avatar: "https://placehold.co/600x400"
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
            progress: 50,
            avatarLink: "https://placehold.co/600x400",
            modules: []
        }];

        this.coursesService.getAllCourses({ pageSize: 6 }).then((response: { data: Course[], pagination: any }) => {
            this.coursesByCategory = response.data;
            this.coursesBySkills = response.data;
            this.courses = response.data;
        });

        this.skillsService.getRootCategories().then((response: { categories: Skill[] }) => {
            this.categoryFilters = response.categories;
            this.categoryFilters.unshift({
                id: "",
                name: "All"
            });
        });

        this.skillsService.getSkills(1, "", 1000000).then((response: { data: Skill[], pagination: any }) => {
            this.skillFilters = response.data;
            this.skillFilters.unshift({
                id: "",
                name: "All"
            });
        });
    }

    choosePanel(panelNumber: number): void {
        this.panelNumber = panelNumber;

        this.filterValue = "";
    }
}
