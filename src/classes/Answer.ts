export class Answer {
    id!: string;
    question_id!: string;
    text!: string;
    answer?: string;
    commentary?: string;
    correct: boolean = false;
    isChecked?: boolean = false;
    isCommentaryVisible?: boolean = false;
}