import { Question } from "./Question";

export class Test {
    id!: string;
    questionCount!: number;
    questions!: Question[];
    results!: {
        score: number;
        maxScore: number;
    }
}