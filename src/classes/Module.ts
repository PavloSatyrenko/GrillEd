import { Lesson } from "./Lesson";

export class Module {
    id!: string;
    name!: string;
    number!: number;
    estimatedTime!: number;
    lessons: Lesson[] = [];
    isOpened?: boolean = false;
    isEditing?: boolean = false;
    newLessonName?: string = "";
    newLessonType?: "VIDEO" | "ARTICLE" | "TEST" = "ARTICLE";
    isLessonNameErrorVisible?: boolean = false;
}