import { Component, ElementRef, inject, OnInit, ViewChild } from "@angular/core";
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

    page: number = 1;
    totalPages: number = 1;

    startedCourses!: Course[];

    courses: Course[] = [];

    coursesByCategory: Course[] = [];
    coursesBySkills: Course[] = [];

    @ViewChild("panel") panel!: ElementRef<HTMLDivElement>;

    scrollTimeout: ReturnType<typeof setTimeout> | null = null;

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

            this.totalPages = response.pagination.total.pages;
        });
    }

    choosePanel(panelNumber: number): void {
        this.panelNumber = panelNumber;

        this.filterValue = "";

        this.page = 1;

        this.coursesService.getAllCourses({ pageSize: 6 }).then((response: { data: Course[], pagination: any }) => {
            this.coursesByCategory = response.data;
            this.coursesBySkills = response.data;
            this.courses = response.data;

            this.totalPages = response.pagination.total.pages;
        });
    }

    onPanelScroll(): void {
        if (this.page < this.totalPages) {
            const threshold: number = 75;

            if (this.panel && this.panel.nativeElement) {
                const scrollTop: number = this.panel.nativeElement.scrollTop;
                const scrollHeight: number = this.panel.nativeElement.scrollHeight;
                const clientHeight: number = this.panel.nativeElement.clientHeight;

                if (scrollHeight - scrollTop - clientHeight <= threshold) {
                    if (this.scrollTimeout) {
                        clearTimeout(this.scrollTimeout);
                    }

                    this.scrollTimeout = setTimeout(() => {
                        this.coursesService.getAllCourses({ page: this.page++, pageSize: 6 }).then((response: { data: Course[], pagination: any }) => {
                            if (this.panelNumber == 1 || this.panelNumber == 2) {
                                this.courses.push(...response.data);
                            }
                            else if (this.panelNumber == 3) {
                                this.coursesByCategory.push(...response.data);
                            }
                            else if (this.panelNumber == 4) {
                                this.coursesBySkills.push(...response.data);
                            }
                        });
                    }, 100);
                }
            }
        }
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
