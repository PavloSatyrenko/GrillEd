import { Routes } from "@angular/router";
import { HomeComponent } from "./home/home.component";
import { MainComponent } from "./main/main.component";
import { canActivateGuard } from "./services/can-activate.guard";

export const routes: Routes = [
    { path: "home", component: HomeComponent, canActivate: [canActivateGuard] },
    { path: "main", component: MainComponent },
    { path: "login", loadComponent: () => import("./authorization/authorization.component").then(c => c.AuthorizationComponent) },
    { path: "signup", loadComponent: () => import("./authorization/authorization.component").then(c => c.AuthorizationComponent) },
    { path: "signup/finish", loadComponent: () => import("./authorization/authorization.component").then(c => c.AuthorizationComponent) },
    { path: "profile", loadComponent: () => import("./profile/profile.component").then(c => c.ProfileComponent), canActivate: [canActivateGuard] },
    { path: "", redirectTo: "home", pathMatch: "full" },
    { path: "**", redirectTo: "not-found", pathMatch: "full" }
];
