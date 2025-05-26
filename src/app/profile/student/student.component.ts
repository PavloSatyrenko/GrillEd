import { CommonModule } from '@angular/common';
import { Component, ElementRef, inject, OnInit, ViewChild } from "@angular/core";
import { User } from "../../../classes/User";
import { DomSanitizer, SafeResourceUrl } from "@angular/platform-browser";
import { FormsModule, NgForm } from "@angular/forms";
import { Skill } from '../../../classes/Skill';
import { SkillPickerComponent } from '../../skill-picker/skill-picker.component';
import { AuthService } from '../../services/auth.service';

@Component({
    selector: "app-student",
    standalone: true,
    imports: [CommonModule, FormsModule, SkillPickerComponent],
    templateUrl: "./student.component.html",
    styleUrl: "./student.component.css"
})
export class StudentComponent implements OnInit {
    user: User | null = null;

    isFormValid: boolean = true;

    @ViewChild("profilePhotoInput") profilePhotoInput!: ElementRef<HTMLInputElement>;
    profilePhotoPath: SafeResourceUrl | null = null;
    // isSizeValid: boolean = true;

    isSkillsPopupVisible: boolean = false;
    studentSkillStep: number = 1;
    selectedSkills: Skill[] = [];

    panelNumber: number = 1;

    private domSanitizer = inject(DomSanitizer);
    private authService: AuthService = inject(AuthService);

    ngOnInit(): void {
        this.user = this.authService.user;
    }

    onPhotoUpload(event: EventTarget | null): void {
        if (event instanceof HTMLInputElement) {
            const file: File | undefined = event.files?.[0];

            if (file) {
                // if (file.size > 2 * 1024 * 1024) {
                //     this.removePhoto();
                //     this.isSizeValid = false;
                //     return;
                // }

                this.profilePhotoPath = this.domSanitizer.bypassSecurityTrustResourceUrl(URL.createObjectURL(file));
            }
        }
    }

    removePhoto(): void {
        this.profilePhotoPath = null;
        this.profilePhotoInput.nativeElement.value = "";
    }

    openSkillsPopup(): void {
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
