import { Answer } from "./Answer";

export class Question {
    id!: string;
    lesson_id!: string;
    text!: string;
    type: "CHOICE" | "MULTICHOICE" = "CHOICE";
    answers: Answer[] = [];
    rightAnswer?: number;
    rightAnswers?: number[];
}