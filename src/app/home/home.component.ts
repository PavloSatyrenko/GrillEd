import { Component, OnInit } from "@angular/core";
import { User } from "../../classes/User";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";

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

    ngOnInit(): void {
        this.user = JSON.parse(localStorage.getItem("user") || "null");
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
}
