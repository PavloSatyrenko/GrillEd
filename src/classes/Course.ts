import { Module } from "./Module";
import { Skill } from "./Skill";

export class Course {
    id!: string;
    author!: {
        id: string,
        avatar: string,
        name: string,
        surname: string
    };
    category!: Skill;
    name!: string;
    about!: string;
    level: "BEGINNER" | "INTERMEDIATE" | "EXPERT" = "BEGINNER";
    status: "ARCHIVED" | "DRAFT" | "PUBLISHED" = "DRAFT";
    estimatedTime!: number;
    enrolledCount!: number;
    rating!: number;
    modules: Module[] = [];
}