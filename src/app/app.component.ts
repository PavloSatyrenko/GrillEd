import { CommonModule } from "@angular/common";
import { Component, ElementRef, HostListener, inject, OnInit, ViewChild } from "@angular/core";
import { NavigationEnd, Router, RouterEvent, Event, RouterModule } from "@angular/router";
import { filter } from "rxjs/operators";
import { User } from "../classes/User";

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

    @ViewChild("userMenu", { static: false }) userMenu!: ElementRef<HTMLElement>;

    private router: Router = inject(Router);

    ngOnInit(): void {
        this.router.events.pipe(
            filter((e: Event | RouterEvent): e is RouterEvent => e instanceof RouterEvent)
        ).subscribe((event: RouterEvent) => {
            if (event instanceof NavigationEnd) {
                this.isHeaderAndFooterVisible = !event.url.includes("login") && !event.url.includes("signup");

                this.user = localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")!) : null;

                this.isUserAuthorized = !!this.user;

                this.isUserMenuVisible = false;
            }
        });
    }

    @HostListener("document:click", ["$event"])
    onClickOutsideUserMenu(event: PointerEvent): void {
        if (this.userMenu && !this.userMenu.nativeElement.contains(event.target as Node)) {
            this.isUserMenuVisible = false;
        }
    }

    toggleUserMenu(): void {
        this.isUserMenuVisible = !this.isUserMenuVisible;
    }

    getUserRole(): string {
        return this.user!.role[0] + this.user!.role.slice(1).toLowerCase();
    }

    logout(): void {
        localStorage.removeItem("user");

        this.user = null;
        this.isUserAuthorized = false;
        this.isUserMenuVisible = false;

        this.router.navigate(["/main"]);
    }
}
