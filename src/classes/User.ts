export class User {
    email!: string;
    password!: string;
    confirmPassword?: string;
    name!: string;
    surname!: string;
    role: "STUDENT" | "TEACHER" = "STUDENT";
}