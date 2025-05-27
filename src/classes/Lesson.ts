import { Question } from "./Question";
import { Link } from "./Link";
import { Test } from "./Test";

export class Lesson {
    id!: string;
    name!: string;
    number!: number;
    type: "VIDEO" | "ARTICLE" | "TEST" = "ARTICLE";
    estimatedTime!: number;
    links?: Link[];
    test?: Test;
    questions?: Question[];
    article?: string;
    articleLink?: string;
    videoLink?: string;
    lessonVideoPreviewPath?: string;
}