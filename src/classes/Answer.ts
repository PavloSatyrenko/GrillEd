export class Answer {
    id!: string;
    question_id!: string;
    text!: string;
    commentary?: string;
    correct: boolean = false;
    isCommentaryVisible?: boolean = false;
}