import { Question } from "./Question";

export class Lesson {
    id!: string;
    name!: string;
    number!: number;
    type: "VIDEO" | "ARTICLE" | "TEST" = "ARTICLE";
    estimatedTime!: number;
    questions?: Question[];
}