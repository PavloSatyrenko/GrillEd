import { Question } from "./Question";
import { Link } from "./Link";

export class Lesson {
    id!: string;
    name!: string;
    number!: number;
    type: "VIDEO" | "ARTICLE" | "TEST" = "ARTICLE";
    estimatedTime!: number;
    links?: Link[];
    questions?: Question[];
    articleLink?: string;
    videoLink?: string;
}