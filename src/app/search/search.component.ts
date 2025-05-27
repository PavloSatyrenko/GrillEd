import { Component, ElementRef, inject, OnInit, ViewChild } from "@angular/core";
import { ActivatedRoute, Params, RouterModule } from "@angular/router";
import { CoursesService } from "../services/courses.service";
import { SkillsService } from "../services/skills.service";
import { Skill } from "../../classes/Skill";
import { CommonModule } from "@angular/common";
import { Course } from "../../classes/Course";

@Component({
    selector: "app-search",
    standalone: true,
    imports: [CommonModule, RouterModule],
    templateUrl: "./search.component.html",
    styleUrl: "./search.component.css"
})
export class SearchComponent implements OnInit {
    courses: Course[] = [];

    searchOptions: {
        page?: number;
        pageSize?: number;
        search?: string;
        categoryId?: string[];
        authorId?: string[];
        level?: ("BEGINNER" | "INTERMEDIATE" | "EXPERT")[];
        status?: ("DRAFT" | "PUBLISHED" | "ARCHIVED")[];
        durationMin?: number;
        durationMax?: number;
        ratingMin?: number;
        ratingMax?: number;
    } = {};

    initialCategories: Skill[] = [];
    categories: Skill[] = [];
    selectedCategories: Skill[] = [];

    skills: Skill[] = [];
    selectedSkills: Skill[] = [];

    selectedLevels: ("BEGINNER" | "INTERMEDIATE" | "EXPERT")[] = [];

    page: number = 1;
    totalPages: number = 1;
    filterValue: string = "";

    @ViewChild("skillsList") skillsList!: ElementRef<HTMLDivElement>;

    scrollTimeout: ReturnType<typeof setTimeout> | null = null;
    filterTimeout: ReturnType<typeof setTimeout> | null = null;

    private activatedRoute: ActivatedRoute = inject(ActivatedRoute);
    private skillsService: SkillsService = inject(SkillsService);
    private coursesService: CoursesService = inject(CoursesService);

    ngOnInit(): void {
        this.skillsService.getRootCategories()
            .then((response: { categories: Skill[] }) => {
                this.initialCategories = response.categories;
                this.categories = this.initialCategories.slice();

                this.activatedRoute.queryParams.subscribe((params: Params) => {
                    const categoryId: string = params["category"];

                    if (categoryId) {
                        this.selectedCategories = this.initialCategories.filter((tempCategory: Skill) => tempCategory.id == categoryId);

                        this.searchOptions.categoryId = [categoryId];

                        this.coursesService.getAllCourses(this.searchOptions).then((response: { data: Course[], pagination: any }) => {
                            this.courses = response.data;
                        });
                    }
                    else {
                        this.coursesService.getAllCourses({}).then((response: { data: Course[], pagination: any }) => {
                            this.courses = response.data;
                        });
                    }
                });
            });

        this.skillsService.getSkills(1, "")
            .then((response: { data: Skill[], pagination: any }) => {
                this.skills = response.data;
                this.totalPages = response.pagination.total.pages;
                setTimeout(() => {
                    this.onSkillsScroll();
                }, 0);
            });
    }

    getLevelString(level: "BEGINNER" | "INTERMEDIATE" | "EXPERT" | undefined): string {
        if (!level) {
            return "Unknown";
        }

        return level.charAt(0).toUpperCase() + level.slice(1).toLowerCase();
    }

    onSkillsScroll(): void {
        if (this.page < this.totalPages) {
            const threshold: number = 50;

            if (this.skillsList && this.skillsList.nativeElement) {
                const scrollTop: number = this.skillsList.nativeElement.scrollTop;
                const scrollHeight: number = this.skillsList.nativeElement.scrollHeight;
                const clientHeight: number = this.skillsList.nativeElement.clientHeight;

                if (scrollHeight - scrollTop - clientHeight <= threshold) {
                    if (this.scrollTimeout) {
                        clearTimeout(this.scrollTimeout);
                    }

                    this.scrollTimeout = setTimeout(() => {
                        this.skillsService.getSkills(++this.page, this.filterValue)
                            .then((response: { data: Skill[], pagination: any }) => {
                                this.skills.push(...response.data);
                                this.totalPages = response.pagination.total.pages;
                                setTimeout(() => {
                                    this.onSkillsScroll();
                                }, 0);
                            });
                    }, 100);
                }
            }
        }
    }

    toggleSkill(skill: Skill): void {
        if (!this.isSkillSelected(skill)) {
            this.selectedSkills.push(skill);
        }
        else {
            this.selectedSkills = this.selectedSkills.filter((selectedSkill: Skill) => selectedSkill.id != skill.id);
        }
    }

    isSkillSelected(skill: Skill): boolean {
        return this.selectedSkills.some((selectedSkill: Skill) => selectedSkill.id == skill.id);
    }

    toggleCategory(category: Skill): void {
        if (!this.isCategorySelected(category)) {
            this.selectedCategories.push(category);
        }
        else {
            this.selectedCategories = this.selectedCategories.filter((selectedCategory: Skill) => selectedCategory.id != category.id);
        }

        this.searchOptions.categoryId = this.selectedCategories.map((selectedCategory: Skill) => selectedCategory.id);

        this.coursesService.getAllCourses(this.searchOptions)
            .then((response: { data: Course[], pagination: any }) => {
                this.courses = response.data;
            });
    }

    isCategorySelected(category: Skill): boolean {
        return this.selectedCategories.some((selectedCategory: Skill) => selectedCategory.id == category.id);
    }

    toggleLevel(level: "BEGINNER" | "INTERMEDIATE" | "EXPERT"): void {
        if (!this.isLevelSelected(level)) {
            this.selectedLevels.push(level);
        }
        else {
            this.selectedLevels = this.selectedLevels.filter((selectedLevel: "BEGINNER" | "INTERMEDIATE" | "EXPERT") => selectedLevel != level);
        }

        this.searchOptions.level = [...this.selectedLevels];

        this.coursesService.getAllCourses(this.searchOptions)
            .then((response: { data: Course[], pagination: any }) => {
                this.courses = response.data;
            });
    }

    isLevelSelected(level: "BEGINNER" | "INTERMEDIATE" | "EXPERT"): boolean {
        return this.selectedLevels.some((selectedLevel: "BEGINNER" | "INTERMEDIATE" | "EXPERT") => selectedLevel == level);
    }

    filterSkills(target: EventTarget | null): void {
        if (!target || !(target instanceof HTMLInputElement)) {
            return;
        }

        this.filterValue = target.value;

        if (this.filterTimeout) {
            clearTimeout(this.filterTimeout);
        }

        this.page = 1;

        this.filterTimeout = setTimeout(() => {
            this.skillsService.getSkills(this.page, this.filterValue)
                .then((response: { data: Skill[], pagination: any }) => {
                    this.skills = response.data;
                    this.totalPages = response.pagination.total.pages;
                    setTimeout(() => {
                        this.onSkillsScroll();
                    }, 0);
                });
        }, 300);
    }

    filterCategories(target: EventTarget | null): void {
        if (!target || !(target instanceof HTMLInputElement)) {
            return;
        }

        const filterValue: string = target.value.toLowerCase();

        if (filterValue) {
            this.categories = this.initialCategories.filter((category: Skill) => category.name.toLowerCase().includes(filterValue));
        }
        else {
            this.categories = this.initialCategories.slice();
        }
    }
}
