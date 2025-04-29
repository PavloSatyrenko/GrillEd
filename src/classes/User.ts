export class User {
    id!: string;
    googleId!: string;
    email!: string;
    password!: string;
    confirmPassword?: string;
    name!: string;
    surname!: string;
    role: "STUDENT" | "TEACHER" = "STUDENT";
    learningStreak!: number;
    avatar!: string;
    teacher!: {
        workplace: string;
        position: string;
        description: string
    } | null
}