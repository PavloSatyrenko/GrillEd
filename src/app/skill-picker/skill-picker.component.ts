import { CommonModule } from "@angular/common";
import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { Skill } from "../../classes/Skill";

@Component({
    selector: "app-skill-picker",
    standalone: true,
    imports: [CommonModule],
    templateUrl: "./skill-picker.component.html",
    styleUrl: "./skill-picker.component.css"
})
export class SkillPickerComponent implements OnInit {
    @Input() initialSkills!: Skill[];
    skills!: Skill[];

    selectedSkills: Skill[] = [];
    @Output() selectedSkillsChange: EventEmitter<Skill[]> = new EventEmitter<Skill[]>();

    ngOnInit(): void {
        this.skills = this.initialSkills;
    }

    toggleSkill(skill: Skill): void {
        const index: number = this.selectedSkills.indexOf(skill);

        if (index == -1) {
            this.selectedSkills.push(skill);
        }
        else {
            this.selectedSkills.splice(index, 1);
        }

        this.selectedSkillsChange.emit(this.selectedSkills);
    }

    isSkillSelected(skill: Skill): boolean {
        return this.selectedSkills.indexOf(skill) != -1;
    }

    filterSkills(target: EventTarget | null): void {
        if (!target || !(target instanceof HTMLInputElement)) {
            return;
        }

        const filter: string = target.value.toLowerCase();

        if (filter) {
            this.skills = this.initialSkills.filter((skill: Skill) => skill.name.toLowerCase().includes(filter));
        }
        else {
            this.skills = this.initialSkills;
        }
    }
}
