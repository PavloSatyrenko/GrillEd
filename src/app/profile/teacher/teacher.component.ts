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

    ngOnInit(): void {
        this.user = this.authService.user;

        // Temporary
        if (this.user !== null) {
            this.user.teacher = {
                workplace: "",
                position: "",
                description: ""
            }
        }

        this.initialCategories = [
            { id: "3dfc9ec3-2ef7-4e8a-ae2c-91f409ff003f", name: "JavaScript" },
            { id: "b1ad9122-fdf9-455b-a9c7-f1191183ce63", name: "Python" },
            { id: "a4d11ec2-b5b1-42dc-bd6c-ded6fbbd7d98", name: "Java" },
            { id: "f8f0a003-b7bb-4447-8690-40df401d5c9f", name: "C#" },
            { id: "1d154a0c-1970-43f6-a7c3-e6fa11dd1582", name: "C++" },
            { id: "d6117717-d105-4933-8fd9-fb845bb5a2e1", name: "Ruby" },
            { id: "0e028a59-6830-45d2-b4b1-9e07d25372c4", name: "PHP" },
            { id: "40aaee74-6bcb-4219-84ec-3650a7c96b7b", name: "Swift" },
            { id: "80b3795d-99ad-4fef-ae14-9fa72926079d", name: "Go" },
            { id: "98fe6d70-34e7-4e47-9cc3-84e021ae8d6a", name: "Kotlin" },
            { id: "36bc01fc-d3ff-404e-bc93-cdc6a8e6a0f6", name: "TypeScript" },
            { id: "68d92b0b-58eb-4b71-95b4-cf70e27825df", name: "Rust" },
            { id: "0cb20b06-01f0-444e-83b7-75f2d00dc5b1", name: "Dart" },
            { id: "8f01f5ae-bc77-4b6b-91ee-8024f3b4015c", name: "Scala" },
            { id: "2ae32ff5-123b-4ae8-90e1-fc107649d8cd", name: "Haskell" },
            { id: "cbbf29e3-f2c0-41c0-bbde-6e1a22e48df8", name: "Elixir" },
            { id: "f69b785c-3937-4403-b80d-b4b77b107373", name: "Clojure" },
            { id: "e94c7dc5-e6bc-4059-a949-503e8eea48f5", name: "Shell" },
            { id: "e3a95c12-fb87-4f8b-bcdc-099c18969c07", name: "HTML" },
            { id: "b5ab222c-50dc-4931-9e97-c390a7e38929", name: "CSS" },
            { id: "fe636d2f-4f69-4643-9b89-f06ae6b105e1", name: "SQL" },
            { id: "81ad5e38-3143-4a8d-8bb1-08d7f0fbe34b", name: "NoSQL" },
            { id: "b0b5ad97-0c4b-48e6-a8a1-476f507fe279", name: "GraphQL" },
            { id: "92f4c7cb-cd76-4623-a7b1-9b4f85a73804", name: "Firebase" },
            { id: "3c0bbf24-bbab-4f47-b6b7-0e5d9c720650", name: "AWS" },
            { id: "f37f289b-df8b-4f93-b9e7-4f1656b5e6b4", name: "Azure" },
            { id: "18bbdf0a-d6f4-4d25-844a-f15528580f88", name: "Google Cloud" },
            { id: "6b30182c-4bb2-4308-b57f-c7aa327b540e", name: "Docker" },
            { id: "73e49a6f-17b6-48e1-bbf6-15b9f9d3872c", name: "Kubernetes" },
            { id: "aaedce70-cab6-4520-a3d3-ff75a28919bb", name: "Terraform" },
            { id: "b38a2326-efc6-429f-b4f2-d2f3016cfb6b", name: "Ansible" },
            { id: "61a99f53-7a70-470e-a8f4-2d5adcfba9d2", name: "Chef" },
            { id: "6259dc94-7c2f-4306-8419-29b26f999726", name: "Puppet" },
            { id: "0fc18893-3731-44b7-b4a1-83c4e3b5b107", name: "Jenkins" },
            { id: "2a37417f-c5d0-41ee-838a-56aa116205f7", name: "Git" },
            { id: "9e4740c3-2624-470f-9d8a-f5b7a5d3b251", name: "SVN" },
            { id: "70e6b0cc-f2e3-426f-bb8d-55fe12ae61d8", name: "Mercurial" },
            { id: "d1e7f85f-3b7c-4b53-a6d0-263c07a7c6c8", name: "Bitbucket" },
            { id: "17b79d6e-25ce-43ce-bd36-92e6fda36c09", name: "GitHub" },
            { id: "ad510b2c-fdfa-4bc1-97e9-635e1c90f1a2", name: "GitLab" },
            { id: "ba43cb64-b53f-4435-90cb-eab3a83dbb39", name: "Jira" },
            { id: "5bcbf8e1-c24d-4f40-a7c7-064aad69ae32", name: "Trello" },
            { id: "71fd3a34-9e0c-4fc4-8989-dcfbe95ff9d8", name: "Slack" },
            { id: "0e3ff158-b83f-4bb3-b430-837e37e93a63", name: "Zoom" },
            { id: "d1ff894e-98b7-4e89-a3a7-c00b6c1d9313", name: "Microsoft Teams" },
            { id: "a3d8f2c2-7be4-44cf-b27a-9e2bb16484d2", name: "Discord" },
            { id: "f0d524a7-6e95-45a3-92d4-64c3e3e9e07b", name: "Skype" },
            { id: "3f6348f7-d9dc-4b56-90f2-9f661b5b3e6e", name: "WhatsApp" },
            { id: "cce15a7d-4f1e-45fc-bbc3-91e8324f2a4e", name: "Telegram" },
            { id: "d3aeae61-9a10-404f-bf3c-7de85e18f00a", name: "Signal" },
            { id: "8ae5980e-62cf-4ae1-9233-09e71c3dfcd8", name: "Viber" },
            { id: "a618c0db-8a1a-4c25-9f64-6794e5417335", name: "WeChat" }
        ];

        this.categories = this.initialCategories;
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
        this.isCourseFormValid = !!this.courseName.trim() && !!this.selectedCategory;

        if (this.isCourseFormValid) {
            this.courseService.createCourse({
                name: this.courseName,
                about: this.courseAbout,
                categoryId: this.selectedCategory!.id,
                level: this.courseLevel
            }).then((responce: Course) => {
                this.isCreateCoursePopupVisible = false;
                this.router.navigate(["course", responce.id, "edit"]);
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
