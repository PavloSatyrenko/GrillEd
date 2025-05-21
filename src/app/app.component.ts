import { CommonModule } from "@angular/common";
import { Component, ElementRef, HostListener, inject, OnInit, ViewChild } from "@angular/core";
import { NavigationEnd, Router, RouterEvent, Event, RouterModule } from "@angular/router";
import { filter } from "rxjs/operators";
import { User } from "../classes/User";
import { AuthService } from "./services/auth.service";
import { Skill } from "../classes/Skill";
import { SkillsService } from "./services/skills.service";

@Component({
    selector: "app-root",
    standalone: true,
    imports: [RouterModule, CommonModule],
    templateUrl: "./app.component.html",
    styleUrl: "./app.component.css"
})
export class AppComponent implements OnInit {
    isHeaderAndFooterVisible: boolean = true;

    user: User | null = null;

    isUserAuthorized: boolean = false;
    isUserMenuVisible: boolean = false;

    isExploreMenuVisible: boolean = false;

    categories: Skill[] = [];

    @ViewChild("userMenu", { static: false }) userMenu!: ElementRef<HTMLElement>;
    @ViewChild("exploreMenu", { static: false }) exploreMenu!: ElementRef<HTMLElement>;

    private router: Router = inject(Router);
    private authService: AuthService = inject(AuthService);
    private skillsService: SkillsService = inject(SkillsService);

    ngOnInit(): void {
        this.authService.me().then((user: User) => {
            this.user = user;
            this.isUserAuthorized = !!user;
        }).catch(() => {
            this.user = null;
            this.isUserAuthorized = false;
        });

        this.router.events.pipe(
            filter((e: Event | RouterEvent): e is RouterEvent => e instanceof RouterEvent)
        ).subscribe((event: RouterEvent) => {
            if (event instanceof NavigationEnd) {
                window.scrollTo(0, 0);

                this.isHeaderAndFooterVisible = !event.url.includes("login") && !event.url.includes("signup");

                this.user = this.authService.user;

                this.isUserAuthorized = !!this.user;

                this.isUserMenuVisible = false;
                this.isExploreMenuVisible = false;
            }
        });

        this.skillsService.getRootSkills()
            .then((response: { categories: Skill[] }) => {
                this.categories = response.categories;
            });

    }

    @HostListener("document:click", ["$event"])
    onClickOutsideMenu(event: PointerEvent): void {
        if (this.userMenu && !this.userMenu.nativeElement.contains(event.target as Node)) {
            this.isUserMenuVisible = false;
        }

        if (this.exploreMenu && !this.exploreMenu.nativeElement.contains(event.target as Node)) {
            this.isExploreMenuVisible = false;
        }
    }

    toggleUserMenu(): void {
        this.isUserMenuVisible = !this.isUserMenuVisible;
    }

    toggleExploreMenu(): void {
        this.isExploreMenuVisible = !this.isExploreMenuVisible;
    }

    getUserRole(): string {
        return this.user!.role[0] + this.user!.role.slice(1).toLowerCase();
    }

    logout(): void {
        this.user = null;
        this.authService.user = null;
        this.isUserAuthorized = false;
        this.isUserMenuVisible = false;

        this.router.navigate(["/main"]);
    }
}
