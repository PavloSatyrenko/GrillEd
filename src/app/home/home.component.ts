import { Component, inject, OnInit } from "@angular/core";
import { User } from "../../classes/User";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { AuthService } from "../services/auth.service";
import { Course } from "../../classes/Course";
import { Router } from "@angular/router";

@Component({
    selector: "app-home",
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: "./home.component.html",
    styleUrl: "./home.component.css"
})
export class HomeComponent implements OnInit {
    user: User | null = null;

    panelNumber: number = 1;
    filterValue: string = "";
    filters: string[] = [];

    startedCourses!: Course[];

    private authService: AuthService = inject(AuthService);
    private router: Router = inject(Router);

    ngOnInit(): void {
        this.user = this.authService.user;

        this.startedCourses = [{
            id: "1",
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
        }, {
            id: "2",
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
        }]
    }

    choosePanel(panelNumber: number): void {
        this.panelNumber = panelNumber;

        if (this.panelNumber == 3) {
            this.filters = ["All", "Software Development", "Programming", "Design", "Marketing", "Business"];
            this.filterValue = "All";
        }
        else if (this.panelNumber == 4) {
            this.filters = ["All", "Java", "Python", "JavaScript", "C++", "C#", "PHP", "Ruby"];
            this.filterValue = "All";
        }
    }

    openCourse(course: Course): void {
        this.router.navigate([`/course/${course.id}`]);
    }
}
