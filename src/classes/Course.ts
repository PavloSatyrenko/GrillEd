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
    estimatedTime!: number;
    enrolledCount!: number;
    rating!: number;
}