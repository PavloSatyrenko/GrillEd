import { CommonModule } from '@angular/common';
import { Component, ElementRef, inject, OnInit, ViewChild } from "@angular/core";
import { User } from "../../../classes/User";
import { DomSanitizer, SafeResourceUrl } from "@angular/platform-browser";
import { FormsModule, NgForm } from "@angular/forms";
import { Skill } from '../../../classes/Skill';
import { SkillPickerComponent } from '../../skill-picker/skill-picker.component';
import { AuthService } from '../../services/auth.service';
import { CoursesService } from '../../services/courses.service';
import { Course } from '../../../classes/Course';
import { ProfileService } from '../../services/profile.service';
import { SkillsService } from '../../services/skills.service';

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
    profilePhoto: File | null = null;
    // isSizeValid: boolean = true;

    isSkillsPopupVisible: boolean = false;
    selectedSkills: Skill[] = [];
    initialSkills: Skill[] = [];

    isCategoriesPopupVisible: boolean = false;
    categories: Skill[] = [];
    initialCategories: Skill[] = [];
    selectedCategories: Skill[] = [];
    initialSelectedCategories: Skill[] = [];

    panelNumber: number = 1;

    courses: Course[] = [];

    private domSanitizer = inject(DomSanitizer);
    private authService: AuthService = inject(AuthService);
    private coursesService: CoursesService = inject(CoursesService);
    private profileService: ProfileService = inject(ProfileService);
    private skillsService: SkillsService = inject(SkillsService);

    ngOnInit(): void {
        this.user = this.authService.user;

        this.coursesService.getAllCourses({}).then((response: { data: Course[], pagination: any }) => {
            this.courses = response.data;

            this.courses.forEach((course: Course) => {
                if (course.progress) {
                    course.animationFrame = Math.ceil(course.progress! / 10);
                    if (course.animationFrame == 0) {
                        course.animationFrame = 1;
                    }
                }
                else {
                    course.animationFrame = 1;
                }
            });
        });

        this.skillsService.getRootCategories()
            .then((response: { categories: Skill[] }) => {
                this.initialCategories = response.categories;
                this.categories = this.initialCategories.slice();
            });
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
                this.profilePhoto = file;
            }
        }
    }

    removePhoto(): void {
        this.profilePhotoPath = null;
        this.profilePhoto = null;
        this.profilePhotoInput.nativeElement.value = "";
    }

    openSkillsPopup(): void {
        this.initialSkills = JSON.parse(JSON.stringify(this.selectedSkills));
        this.isSkillsPopupVisible = true;
    }

    closeSkillsPopup(): void {
        this.selectedSkills = JSON.parse(JSON.stringify(this.initialSkills));
        this.isSkillsPopupVisible = false;
    }

    saveSkills(): void {
        this.isSkillsPopupVisible = false;
    }

    openCategoriesPopup(): void {
        this.initialSelectedCategories = JSON.parse(JSON.stringify(this.selectedCategories));
        this.isCategoriesPopupVisible = true;
    }

    closeCategoriesPopup(): void {
        this.selectedCategories = JSON.parse(JSON.stringify(this.initialSelectedCategories));
        this.isCategoriesPopupVisible = false;
    }

    filterCategories(target: EventTarget | null): void {
        if (!target || !(target instanceof HTMLInputElement)) {
            return;
        }

        const filter: string = target.value.toLowerCase();

        if (filter) {
            this.categories = this.initialCategories.filter((category: Skill) => category.name.toLowerCase().includes(filter));
        }
        else {
            this.categories = this.initialCategories;
        }
    }

    selectCategory(category: Skill): void {
        if (this.isCategorySelected(category)) {
            this.selectedCategories = this.selectedCategories.filter((selectedCategory: Skill) => selectedCategory.id !== category.id);
        }
        else {
            this.selectedCategories.push(category);
        }
    }

    isCategorySelected(category: Skill): boolean {
        return this.selectedCategories.some((selectedCategory: Skill) => selectedCategory.id === category.id);
    }

    saveCategories(): void {
        this.isCategoriesPopupVisible = false;
    }

    choosePanel(panelNumber: number): void {
        this.panelNumber = panelNumber;
    }

    onSubmit(form: NgForm): void {
        if (form.valid) {
            this.profileService.updateUserProfile({
                name: this.user!.name.trim(),
                surname: this.user!.surname.trim(),
            }).then(() => {
                if (this.selectedCategories.length > 0) {
                    const categoriesIds: string[] = this.selectedCategories.map((category: Skill) => category.id);

                    this.skillsService.followCategories(categoriesIds).then(() => {
                        this.updateUser();
                    });
                }

                if (this.selectedSkills.length > 0) {
                    const skillsIds: string[] = this.selectedSkills.map((skill: Skill) => skill.id);

                    this.skillsService.followSkills(skillsIds).then(() => {
                        this.updateUser();
                    });
                }

                if (this.profilePhoto) {
                    const formData: FormData = new FormData();
                    formData.append("avatar", this.profilePhoto);

                    this.profileService.updateUserPhoto(formData).then(() => {
                        this.updateUser();
                    });
                }

                if (!this.profilePhoto && !this.selectedSkills.length && !this.selectedCategories.length) {
                    this.updateUser();
                }
            });
        } else {
            this.isFormValid = false;
        }
    }

    updateUser(): void {
        this.authService.me().then((user: User) => {
            this.user = user;
        });
    }
}
