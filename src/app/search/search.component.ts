import { Component, inject, OnInit } from "@angular/core";
import { ActivatedRoute, Params } from "@angular/router";
import { CoursesService } from "../services/courses.service";
import { SkillsService } from "../services/skills.service";
import { Skill } from "../../classes/Skill";
import { CommonModule } from "@angular/common";

@Component({
    selector: "app-search",
    standalone: true,
    imports: [CommonModule],
    templateUrl: "./search.component.html",
    styleUrl: "./search.component.css"
})
export class SearchComponent implements OnInit {

    categories: Skill[] = [];

    private activatedRoute: ActivatedRoute = inject(ActivatedRoute);
    private skillsService: SkillsService = inject(SkillsService);
    private coursesService: CoursesService = inject(CoursesService);

    ngOnInit(): void {
        this.activatedRoute.queryParams.subscribe((params: Params) => {
            const category: string = params["category"];

            if (category) {

            }
        });

        this.skillsService.getRootSkills()
            .then((response: { categories: Skill[] }) => {
                this.categories = response.categories;
            });
    }

}
