import { CommonModule } from "@angular/common";
import { Component, ElementRef, HostListener, inject, OnInit, ViewChild } from "@angular/core";
import { NavigationEnd, Router, RouterEvent, Event, RouterModule } from "@angular/router";
import { filter } from "rxjs/operators";
import { User } from "../classes/User";
import { AuthService } from "./services/auth.service";

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

    @ViewChild("userMenu", { static: false }) userMenu!: ElementRef<HTMLElement>;
    @ViewChild("exploreMenu", { static: false }) exploreMenu!: ElementRef<HTMLElement>;

    private router: Router = inject(Router);
    private authService: AuthService = inject(AuthService);

    ngOnInit(): void {
        this.router.events.pipe(
            filter((e: Event | RouterEvent): e is RouterEvent => e instanceof RouterEvent)
        ).subscribe((event: RouterEvent) => {
            if (event instanceof NavigationEnd) {
                this.isHeaderAndFooterVisible = !event.url.includes("login") && !event.url.includes("signup");

                this.user = this.authService.user;

                this.isUserAuthorized = !!this.user;

                this.isUserMenuVisible = false;
            }
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
