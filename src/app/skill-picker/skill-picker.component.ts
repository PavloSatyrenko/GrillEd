import { CommonModule } from "@angular/common";
import { Component, ElementRef, EventEmitter, HostListener, inject, Input, OnInit, Output, ViewChild } from "@angular/core";
import { Skill } from "../../classes/Skill";
import { SkillsService } from "../services/skills.service";

@Component({
    selector: "app-skill-picker",
    standalone: true,
    imports: [CommonModule],
    templateUrl: "./skill-picker.component.html",
    styleUrl: "./skill-picker.component.css"
})
export class SkillPickerComponent implements OnInit {
    skills!: Skill[];

    page: number = 1;
    totalPages: number = 1;
    filterValue: string = "";

    @Input() selectedSkills: Skill[] = [];
    @Output() selectedSkillsChange: EventEmitter<Skill[]> = new EventEmitter<Skill[]>();

    @ViewChild("skillsList") skillsList!: ElementRef<HTMLDivElement>;

    scrollTimeout: ReturnType<typeof setTimeout> | null = null;
    filterTimeout: ReturnType<typeof setTimeout> | null = null;

    private skillsService: SkillsService = inject(SkillsService);

    ngOnInit(): void {
        this.skillsService.getSkills(1, "")
            .then((response: { data: Skill[], pagination: any }) => {
                this.skills = response.data;
                this.totalPages = response.pagination.total.pages;
                setTimeout(() => {
                    this.onSkillsScroll();
                }, 0);
            });
    }

    onSkillsScroll(): void {
        if (this.page < this.totalPages) {
            const threshold: number = 75;

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

        this.selectedSkillsChange.emit(this.selectedSkills);
    }

    isSkillSelected(skill: Skill): boolean {
        return this.selectedSkills.some((selectedSkill: Skill) => selectedSkill.id == skill.id);
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
}
