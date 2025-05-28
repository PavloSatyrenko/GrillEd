import { Component, inject, OnInit } from "@angular/core";
import { User } from "../../classes/User";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { AuthService } from "../services/auth.service";
import { Course } from "../../classes/Course";
import { RouterModule } from "@angular/router";
import { CoursesService } from "../services/courses.service";
import { Skill } from "../../classes/Skill";
import { ProfileService } from "../services/profile.service";

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
    private profileService: ProfileService = inject(ProfileService);

    ngOnInit(): void {
        this.user = this.authService.user;

        if (this.user!.role == "STUDENT") {
            this.coursesService.getStudentCourses({ status: ["ACTIVE"] }).then((response: { data: Course[], pagination: any }) => {
                this.startedCourses = response.data;
                console.log(this.startedCourses);
            });

            this.coursesService.getStudentCourses({}).then((response: { data: Course[], pagination: any }) => {
                this.startedCourses = response.data;
                console.log(this.startedCourses);
            });

            this.profileService.getUserCategories().then((categories: Skill[]) => {
                this.categoryFilters = categories;
                this.categoryFilters.unshift({
                    id: "",
                    name: "All"
                });
            });

            this.profileService.getUserSkills().then((skills: Skill[]) => {
                this.skillFilters = skills;
                this.skillFilters.unshift({
                    id: "",
                    name: "All"
                });
            });
        }
        else if (this.user!.role == "TEACHER") {
            this.panelNumber = 1;
            this.coursesService.getTeacherCourses({}).then((response: { data: Course[], pagination: any }) => {
                this.startedCourses = response.data;
            });

        }

        this.coursesService.getAllCourses({ pageSize: 6 }).then((response: { data: Course[], pagination: any }) => {
            this.coursesByCategory = response.data;
            this.coursesBySkills = response.data;
            this.courses = response.data;
        });
    }

    choosePanel(panelNumber: number): void {
        this.panelNumber = panelNumber;

        this.filterValue = "";

        this.coursesService.getAllCourses({ pageSize: 6 }).then((response: { data: Course[], pagination: any }) => {
            this.coursesByCategory = response.data;
            this.coursesBySkills = response.data;
            this.courses = response.data;
        });
    }

    filterCoursesByCategory(): void {
        if (this.filterValue == "") {
            this.coursesService.getAllCourses({ pageSize: 6 }).then((response: { data: Course[], pagination: any }) => {
                this.coursesByCategory = response.data;
            });
        }
        else {
            this.coursesService.getAllCourses({ pageSize: 6, categoryId: [this.filterValue] }).then((response: { data: Course[], pagination: any }) => {
                this.coursesByCategory = response.data;
            });
        }
    }

    filterCoursesBySkills(): void {
        if (this.filterValue == "") {
            this.coursesService.getAllCourses({ pageSize: 6 }).then((response: { data: Course[], pagination: any }) => {
                this.coursesBySkills = response.data;
            });
        }
        else {
            this.coursesService.getAllCourses({ pageSize: 6, skillId: [this.filterValue] }).then((response: { data: Course[], pagination: any }) => {
                this.coursesBySkills = response.data;
            });
        }
    }
}
