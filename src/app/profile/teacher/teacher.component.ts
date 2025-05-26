import { CommonModule } from '@angular/common';
import { Component, ElementRef, inject, OnInit, ViewChild } from "@angular/core";
import { User } from "../../../classes/User";
import { DomSanitizer, SafeResourceUrl } from "@angular/platform-browser";
import { FormsModule, NgForm } from "@angular/forms";
import { SkillPickerComponent } from '../../skill-picker/skill-picker.component';
import { AuthService } from '../../services/auth.service';
import { Link } from '../../../classes/Link';
import { Router, RouterModule } from '@angular/router';
import { CoursesService } from '../../services/courses.service';
import { Course } from '../../../classes/Course';
import { Skill } from '../../../classes/Skill';
import { SkillsService } from '../../services/skills.service';

@Component({
    selector: "app-teacher",
    standalone: true,
    imports: [CommonModule, FormsModule, SkillPickerComponent, RouterModule],
    templateUrl: "./teacher.component.html",
    styleUrl: "./teacher.component.css"
})
export class TeacherComponent implements OnInit {
    user: User | null = null;

    isFormValid: boolean = true;

    @ViewChild("profilePhotoInput") profilePhotoInput!: ElementRef<HTMLInputElement>;
    profilePhotoPath: SafeResourceUrl | null = null;
    // isSizeValid: boolean = true;

    isCertificatePopupVisible: boolean = false;
    initialCertificates: string[] = [];
    certificates: string[] = [];
    @ViewChild("certificateInput") certificateInput!: ElementRef<HTMLInputElement>;

    isLinkPopupVisible: boolean = false;
    initialLinks: Link[] = [];
    links: Link[] = [];
    isLinkFormValid: boolean = true;

    isCreateCoursePopupVisible: boolean = false;
    courseName: string = "";
    courseAbout: string = "";
    courseLevel: "BEGINNER" | "INTERMEDIATE" | "EXPERT" = "BEGINNER";
    initialCategories: Skill[] = [];
    categories: Skill[] = [];
    selectedCategory: Skill | null = null;
    isCourseFormValid: boolean = true;

    panelNumber: number = 1;

    private domSanitizer: DomSanitizer = inject(DomSanitizer);
    private router: Router = inject(Router);
    private authService: AuthService = inject(AuthService);
    private courseService: CoursesService = inject(CoursesService);
    private skillsService: SkillsService = inject(SkillsService);

    ngOnInit(): void {
        this.user = this.authService.user;

        this.skillsService.getRootCategories().then((response: { categories: Skill[] }) => {
            this.initialCategories = response.categories;

            this.categories = this.initialCategories;
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
            }
        }
    }

    removePhoto(): void {
        this.profilePhotoPath = null;
        this.profilePhotoInput.nativeElement.value = "";
    }

    openCertificatePopup(): void {
        this.initialCertificates = this.certificates.slice();
        this.isCertificatePopupVisible = true;
    }

    closeCertificatePopup(): void {
        this.certificates = this.initialCertificates;
        this.isCertificatePopupVisible = false;
    }

    onCertificateUpload(event: EventTarget | null): void {
        if (event instanceof HTMLInputElement) {
            const file: File | undefined = event.files?.[0];

            if (file) {
                // if (file.size > 2 * 1024 * 1024) {
                //     this.removeCertificate();
                //     return;
                // }

                this.certificates.push(file.name);
            }
        }
    }

    removeCertificate(certificate: string): void {
        this.certificates.splice(this.certificates.indexOf(certificate), 1);
        this.certificateInput.nativeElement.value = "";
    }

    saveCertificates(): void {
        this.isCertificatePopupVisible = false;
    }

    openLinkPopup(): void {
        this.initialLinks = JSON.parse(JSON.stringify(this.links));
        this.isLinkPopupVisible = true;
    }

    closeLinkPopup(): void {
        this.links = this.initialLinks;
        this.isLinkPopupVisible = false;
    }

    addLink(): void {
        this.links.push(new Link());
    }

    removeLink(link: Link): void {
        this.links.splice(this.links.indexOf(link), 1);
    }

    saveLinks(): void {
        this.isLinkFormValid = this.links.every((link: Link) => link.name.trim() && link.url.trim());

        if (this.isLinkFormValid) {
            this.isLinkPopupVisible = false;
        }
    }

    openCreateCoursePopup(): void {
        this.courseName = "";
        this.courseAbout = "";
        this.courseLevel = "BEGINNER";
        this.selectedCategory = null;

        this.isCreateCoursePopupVisible = true;
    }

    closeCreateCoursePopup(): void {
        this.isCreateCoursePopupVisible = false;
    }

    createCourse(): void {
        this.isCourseFormValid = !!this.courseName.trim() && !!this.courseAbout.trim() && !!this.selectedCategory;

        if (this.isCourseFormValid) {
            this.courseService.createCourse({
                name: this.courseName,
                about: this.courseAbout,
                categoryId: this.selectedCategory!.id,
                level: this.courseLevel
            }).then((response: Course) => {
                this.isCreateCoursePopupVisible = false;
                this.router.navigate(["course", response.id, "edit"]);
            });
        }
    }

    selectCategory(category: Skill): void {
        this.selectedCategory = category;
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

    choosePanel(panelNumber: number): void {
        this.panelNumber = panelNumber;
    }

    onSubmit(form: NgForm): void {

    }
}
