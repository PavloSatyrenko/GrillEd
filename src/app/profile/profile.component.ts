import { CommonModule } from '@angular/common';
import { Component, ElementRef, inject, OnInit, ViewChild } from "@angular/core";
import { User } from "../../classes/User";
import { DomSanitizer, SafeResourceUrl } from "@angular/platform-browser";
import { FormsModule, NgForm } from "@angular/forms";
import { Skill } from '../../classes/Skill';
import { SkillPickerComponent } from '../skill-picker/skill-picker.component';

@Component({
    selector: "app-profile",
    standalone: true,
    imports: [CommonModule, FormsModule, SkillPickerComponent],
    templateUrl: "./profile.component.html",
    styleUrl: "./profile.component.css"
})
export class ProfileComponent implements OnInit {
    user: User | null = null;

    isFormValid: boolean = true;

    @ViewChild("profilePhotoInput") profilePhotoInput!: ElementRef<HTMLInputElement>;
    profilePhotoPath: SafeResourceUrl | null = null;
    isSizeValid: boolean = true;

    isSkillsPopupVisible: boolean = false;
    studentSkillStep: number = 1;
    skills: Skill[] = [];
    selectedSkills: Skill[] = [];

    panelNumber: number = 1;

    private domSanitizer = inject(DomSanitizer);

    ngOnInit(): void {
        this.user = JSON.parse(localStorage.getItem("user") || "null");
    }

    onPhotoUpload(event: EventTarget | null): void {
        if (event instanceof HTMLInputElement) {
            const file: File | undefined = event.files?.[0];

            if (file) {
                if (file.size > 2 * 1024 * 1024) {
                    this.removePhoto();
                    this.isSizeValid = false;
                    return;
                }

                this.profilePhotoPath = this.domSanitizer.bypassSecurityTrustResourceUrl(URL.createObjectURL(file));
            }
        }
    }

    removePhoto(): void {
        this.profilePhotoPath = null;
        this.profilePhotoInput.nativeElement.value = "";
    }

    openSkillsPopup(): void {
        this.skills = [{ name: "JavaScript" }, { name: "Python" }, { name: "Java" }, { name: "C#" }, { name: "C++" }, { name: "Ruby" }, { name: "PHP" }, { name: "Swift" }, { name: "Go" }, { name: "Kotlin" }, { name: "TypeScript" }, { name: "Rust" }, { name: "Dart" }, { name: "Scala" }, { name: "Haskell" }, { name: "Elixir" }, { name: "Clojure" }, { name: "Shell" }, { name: "HTML" }, { name: "CSS" }, { name: "SQL" }, { name: "NoSQL" }, { name: "GraphQL" }, { name: "Firebase" }, { name: "AWS" }, { name: "Azure" }, { name: "Google Cloud" }, { name: "Docker" }, { name: "Kubernetes" }, { name: "Terraform" }, { name: "Ansible" }, { name: "Chef" }, { name: "Puppet" }, { name: "Jenkins" }, { name: "Git" }, { name: "SVN" }, { name: "Mercurial" }, { name: "Bitbucket" }, { name: "GitHub" }, { name: "GitLab" }, { name: "Jira" }, { name: "Trello" }, { name: "Slack" }, { name: "Zoom" }, { name: "Microsoft Teams" }, { name: "Discord" }, { name: "Skype" }, { name: "WhatsApp" }, { name: "Telegram" }, { name: "Signal" }, { name: "Viber" }, { name: "WeChat" }];

        this.isSkillsPopupVisible = true;
    }

    closeSkillsPopup(): void {
        this.isSkillsPopupVisible = false;
    }

    goToNextSkillStep(): void {
        this.studentSkillStep = 2;
    }

    goToPreviousSkillStep(): void {
        this.studentSkillStep = 1;
    }

    saveSkills(): void {

    }

    choosePanel(panelNumber: number): void {
        this.panelNumber = panelNumber;
    }

    onSubmit(form: NgForm): void {

    }
}
