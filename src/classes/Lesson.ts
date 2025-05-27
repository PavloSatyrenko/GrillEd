import { Question } from "./Question";
import { Link } from "./Link";
import { Test } from "./Test";
import { SafeHtml } from "@angular/platform-browser";

export class Lesson {
    id!: string;
    name!: string;
    number!: number;
    type: "VIDEO" | "ARTICLE" | "TEST" = "ARTICLE";
    estimatedTime!: number;
    completed?: boolean;
    links?: Link[];
    test?: Test;
    questions?: Question[];
    article?: string;
    safeArticle?: SafeHtml;
    articleLink?: string;
    videoLink?: string;
    lessonVideoPreviewPath?: string;
}