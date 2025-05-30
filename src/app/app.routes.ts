import { Routes } from "@angular/router";
import { HomeComponent } from "./home/home.component";
import { MainComponent } from "./main/main.component";
import { canActivateGuard } from "./services/can-activate.guard";
import { canActivateStudentGuard } from "./services/can-activate-student.guard";
import { canActivateTeacherGuard } from "./services/can-activate-teacher.guard";

export const routes: Routes = [
    { path: "home", component: HomeComponent, canActivate: [canActivateGuard] },
    { path: "main", component: MainComponent },
    { path: "login", loadComponent: () => import("./authorization/authorization.component").then(c => c.AuthorizationComponent) },
    { path: "signup", loadComponent: () => import("./authorization/authorization.component").then(c => c.AuthorizationComponent) },
    { path: "signup/finish", loadComponent: () => import("./authorization/authorization.component").then(c => c.AuthorizationComponent) },
    { path: "profile/student", loadComponent: () => import("./profile/student/student.component").then(c => c.StudentComponent), canActivate: [canActivateStudentGuard] },
    { path: "profile/teacher", loadComponent: () => import("./profile/teacher/teacher.component").then(c => c.TeacherComponent), canActivate: [canActivateTeacherGuard] },
    { path: "course/:id", loadComponent: () => import("./course/course.component").then(c => c.CourseComponent) },
    { path: "course/:id/flow", loadComponent: () => import("./course-flow/course-flow.component").then(c => c.CourseFlowComponent), canActivate: [canActivateStudentGuard] },
    { path: "course/:id/edit", loadComponent: () => import("./course-editing/course-editing.component").then(c => c.CourseEditingComponent), canActivate: [canActivateTeacherGuard] },
    { path: "search", loadComponent: () => import("./search/search.component").then(c => c.SearchComponent) },
    { path: "", redirectTo: "home", pathMatch: "full" },
    { path: "**", redirectTo: "not-found", pathMatch: "full" }
];
