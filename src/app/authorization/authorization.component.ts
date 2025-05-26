import { Component, ElementRef, inject, OnInit, ViewChild } from "@angular/core";
import { Router, RouterEvent, Event, NavigationEnd, ActivatedRoute, Params } from "@angular/router";
import { FormsModule, NgForm } from "@angular/forms";
import { User } from "../../classes/User";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { filter } from "rxjs/operators";
import { SkillPickerComponent } from "../skill-picker/skill-picker.component";
import { Skill } from "../../classes/Skill";
import { DomSanitizer, SafeResourceUrl } from "@angular/platform-browser";
import { Link } from "../../classes/Link";
import { AuthService } from "../services/auth.service";

enum PageTypeEnum {
    Login = "login",
    Signup = "signup",
    Finish = "signup/finish"
}

@Component({
    selector: "app-authorization",
    standalone: true,
    imports: [FormsModule, CommonModule, RouterModule, SkillPickerComponent],
    templateUrl: "./authorization.component.html",
    styleUrl: "./authorization.component.css"
})
export class AuthorizationComponent implements OnInit {
    pageType!: PageTypeEnum;

    user: User = new User();

    isFormValid: boolean = true;
    arePasswordsEqual: boolean = true;

    studentSkillStep: number = 1;
    selectedSkills: Skill[] = [];

    @ViewChild("teacherPhotoInput") teacherPhotoInput!: ElementRef<HTMLInputElement>;
    teacherPhotoPath: SafeResourceUrl | null = null;
    // isSizeValid: boolean = true;

    isCertificatePopupVisible: boolean = false;
    initialCertificates: string[] = [];
    certificates: string[] = [];
    @ViewChild("certificateInput") certificateInput!: ElementRef<HTMLInputElement>;

    isLinkPopupVisible: boolean = false;
    initialLinks: Link[] = [];
    links: Link[] = [];
    isLinkFormValid: boolean = true;

    PageTypeEnum = PageTypeEnum;

    private router: Router = inject(Router);
    private activatedRoute: ActivatedRoute = inject(ActivatedRoute);

    private domSanitizer = inject(DomSanitizer);

    private authService: AuthService = inject(AuthService);

    ngOnInit(): void {
        this.setPageType(this.router.url);

        this.router.events.pipe(
            filter((e: Event | RouterEvent): e is RouterEvent => e instanceof RouterEvent)
        ).subscribe((event: RouterEvent) => {
            if (event instanceof NavigationEnd) {
                this.setPageType(this.router.url);
            }
        });
    }

    setPageType(url: string): void {
        if (url.includes(PageTypeEnum.Login)) {
            this.pageType = PageTypeEnum.Login;
        }
        else if (url.includes(PageTypeEnum.Finish)) {
            this.pageType = PageTypeEnum.Finish;

            this.activatedRoute.queryParams.subscribe((params: Params) => {
                this.authService.verifyEmail(params["token"]).then(() => {
                    console.log("Email verified successfully.");
                    this.authService.me().then(() => {
                        console.log(this.authService.user);
                        this.user = this.authService.user!;
                    });
                });
            });
        }
        else if (url.includes(PageTypeEnum.Signup)) {
            this.pageType = PageTypeEnum.Signup;
        }
    }

    changePasswordType(inputElement: HTMLInputElement): void {
        inputElement.type = inputElement.type === "password" ? "text" : "password";
    }

    onSubmit(form: NgForm): void {
        if (form.valid) {
            if (this.pageType == PageTypeEnum.Login) {
                this.authService.login(this.user).then(() => {
                    this.authService.me().then(() => {
                        this.router.navigate([""]);
                    });
                }).catch((error: any) => {
                    console.error("Login failed:", error);
                });
            }
            else if (this.pageType == PageTypeEnum.Signup) {
                this.arePasswordsEqual = this.user.password == this.user.confirmPassword;

                if (this.arePasswordsEqual) {
                    this.authService.signup(this.user).then(() => {
                        alert("Check your email to verify your account.");
                    }).catch((error: any) => {
                        console.error("Login failed:", error);
                    });
                }
                else {
                    this.isFormValid = false;
                }
            }
        }
        else {
            this.isFormValid = false;
        }
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

                this.teacherPhotoPath = this.domSanitizer.bypassSecurityTrustResourceUrl(URL.createObjectURL(file));
            }
        }
    }

    removePhoto(): void {
        this.teacherPhotoPath = null;
        this.teacherPhotoInput.nativeElement.value = "";
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

    onFinishSkip(): void {
        this.router.navigate([""]);
    }

    onFinishPrevious(): void {
        this.studentSkillStep = 1;
    }

    onFinishContinue(): void {
        if (this.user.role == "STUDENT") {
            if (this.studentSkillStep == 1) {
                this.studentSkillStep = 2;
            }
            else {
                this.router.navigate([""]);
            }
        }
        else {
            this.router.navigate([""]);
        }
    }
}
