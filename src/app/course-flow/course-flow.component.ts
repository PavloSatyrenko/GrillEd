import { CommonModule } from "@angular/common";
import { Component, inject } from "@angular/core";
import { Course } from "../../classes/Course";
import { ActivatedRoute, ParamMap, Router } from "@angular/router";
import { CoursesService } from "../services/courses.service";
import { Lesson } from "../../classes/Lesson";
import { Module } from "../../classes/Module";
import { DomSanitizer } from "@angular/platform-browser";
import { FormsModule } from "@angular/forms";
import { Question } from "../../classes/Question";
import { Answer } from "../../classes/Answer";

@Component({
    selector: "app-course-flow",
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: "./course-flow.component.html",
    styleUrl: "./course-flow.component.css"
})
export class CourseFlowComponent {
    courseId: string = "";

    course: Course | null = null;

    activeLessonId!: string;
    activeLesson: Lesson | null = null;

    animationFrame: number = 1;

    private activatedRoute: ActivatedRoute = inject(ActivatedRoute);
    private router: Router = inject(Router);
    private sanitizer: DomSanitizer = inject(DomSanitizer);
    private coursesService: CoursesService = inject(CoursesService);

    ngOnInit(): void {
        this.activatedRoute.paramMap.subscribe((params: ParamMap) => {
            this.courseId = params.get("id")!;

            this.coursesService.getCourse(this.courseId).then((course: Course) => {
                this.course = course;

                this.animationFrame = Math.ceil(course.progress! / 10);
                if (this.animationFrame == 0) {
                    this.animationFrame = 1;
                }

                this.activeLessonId = this.getNextLessonId();

                this.coursesService.getLesson(this.courseId, this.activeLessonId).then((lesson: Lesson) => {
                    this.activeLesson = lesson;

                    this.openActiveModule();

                    if (this.activeLesson.type == "ARTICLE" && this.activeLesson.articleLink) {
                        this.coursesService.getLessonArticle(this.activeLesson.articleLink!).then(async (response: any) => {
                            const reader: ReadableStreamDefaultReader = (response.body as ReadableStream).getReader();
                            const chunks: Uint8Array[] = [];

                            let readResult: ReadableStreamReadResult<any> = await reader.read();
                            while (!readResult.done) {
                                if (readResult.value) {
                                    chunks.push(readResult.value);
                                }

                                readResult = await reader.read();
                            }

                            const blob: Blob = new Blob(chunks, { type: "text/html" });
                            const text: string = await blob.text();
                            const parsedText: string = text.replaceAll("&nbsp;", " ");

                            this.activeLesson!.safeArticle = this.sanitizer.bypassSecurityTrustHtml(parsedText);
                        });
                    }
                    else if (this.activeLesson.type == "TEST") {
                        console.log(this.activeLesson);

                        // this.coursesService.getTestQuestions(this.courseId, this.activeLesson.test!.id).then((test: Test) => {
                        //     this.lesson.questions = test.questions;

                        //     this.lesson.questions.forEach((question: Question) => {
                        //         question.answers.forEach((answer: Answer) => {
                        //             if (question.type == "CHOICE") {
                        //                 answer.correct = question.rightAnswer == answer.id;
                        //             }
                        //             else if (question.type == "MULTICHOICE") {
                        //                 answer.correct = (question.rightAnswers as string[]).includes(answer.id);
                        //             }

                        //             answer.text = answer.answer!;
                        //             answer.isCommentaryVisible = !!answer.commentary;
                        //         });
                        //     });

                        //     this.isLessonPopupVisible = true;
                        //     document.body.style.overflow = "hidden";
                        // });

                        this.coursesService.getTestQuestions(this.courseId, this.activeLesson.id).then((questions: Question[]) => {
                            this.activeLesson!.questions = questions.map((question: Question) => {
                                if (question.type == "CHOICE") {
                                    question.rightAnswer = question.answers!.indexOf(question.answers!.find((answer: Answer) => answer.correct)!);
                                }
                                else if (question.type == "MULTICHOICE") {
                                    question.rightAnswers = question.answers!.reduce((correctAnswerIndices: number[], answer: Answer, index: number) => {
                                        if (answer.correct) {
                                            correctAnswerIndices.push(index);
                                        }
                                        return correctAnswerIndices;
                                    }, []);
                                }

                                question.answers = question.answers!.map((answer: Answer) => {
                                    if (answer.isCommentaryVisible) {
                                        answer.commentary = answer.commentary;
                                    }
                                    else {
                                        answer.commentary = undefined;
                                    }
                                    return answer;
                                });

                                return question;
                            });
                        });
                    }
                });

                console.log(this.course);
            }).catch((error: any) => {
                console.error("Error fetching course:", error);
                this.router.navigate(["/home"]);
            });
        });
    }

    getModuleLessonAmount(module: Module, type: "ARTICLE" | "VIDEO" | "TEST"): number {
        return module.lessons.filter((lesson: Lesson) => lesson.type == type).length;
    }

    getTimeString(minutes: number | undefined): string {
        if (minutes === undefined || minutes < 0) {
            return "Unknown";
        }

        const hours: number = Math.floor(minutes / 60);
        const mins: number = minutes % 60;

        if (hours > 0) {
            return `${hours} h ${mins} min`;
        }
        else {
            return `${mins} min`;
        }
    }

    toggleModule(module: Module): void {
        if (module.isEditing) {
            return;
        }

        module.isOpened = !module.isOpened;

        module.newLessonName = "";
        module.newLessonType = "ARTICLE";
        module.isLessonNameErrorVisible = false;
    }

    selectLesson(lesson: Lesson): void {
        this.activeLessonId = lesson.id;

        this.coursesService.getLesson(this.courseId, this.activeLessonId).then((lesson: Lesson) => {
            this.activeLesson = lesson;
            console.log(this.activeLesson);

            if (this.activeLesson.type == "ARTICLE" && this.activeLesson.articleLink) {
                this.coursesService.getLessonArticle(this.activeLesson.articleLink!).then(async (response: any) => {
                    const reader: ReadableStreamDefaultReader = (response.body as ReadableStream).getReader();
                    const chunks: Uint8Array[] = [];

                    let readResult: ReadableStreamReadResult<any> = await reader.read();
                    while (!readResult.done) {
                        if (readResult.value) {
                            chunks.push(readResult.value);
                        }

                        readResult = await reader.read();
                    }

                    const blob: Blob = new Blob(chunks, { type: "text/html" });
                    const text: string = await blob.text();
                    const parsedText: string = text.replaceAll("&nbsp;", " ");

                    this.activeLesson!.safeArticle = this.sanitizer.bypassSecurityTrustHtml(parsedText);
                });
            }
            else if (this.activeLesson.type == "TEST") {
                console.log(this.activeLesson);

                // this.coursesService.getTestQuestions(this.courseId, this.activeLesson.test!.id).then((test: Test) => {
                //     this.lesson.questions = test.questions;

                //     this.lesson.questions.forEach((question: Question) => {
                //         question.answers.forEach((answer: Answer) => {
                //             if (question.type == "CHOICE") {
                //                 answer.correct = question.rightAnswer == answer.id;
                //             }
                //             else if (question.type == "MULTICHOICE") {
                //                 answer.correct = (question.rightAnswers as string[]).includes(answer.id);
                //             }

                //             answer.text = answer.answer!;
                //             answer.isCommentaryVisible = !!answer.commentary;
                //         });
                //     });

                //     this.isLessonPopupVisible = true;
                //     document.body.style.overflow = "hidden";
                // });

                this.coursesService.getTestQuestions(this.courseId, this.activeLesson.id).then((questions: Question[]) => {
                    this.activeLesson!.questions = questions.map((question: Question) => {
                        if (question.type == "CHOICE") {
                            question.rightAnswer = question.answers!.indexOf(question.answers!.find((answer: Answer) => answer.correct)!);
                        }
                        else if (question.type == "MULTICHOICE") {
                            question.rightAnswers = question.answers!.reduce((correctAnswerIndices: number[], answer: Answer, index: number) => {
                                if (answer.correct) {
                                    correctAnswerIndices.push(index);
                                }
                                return correctAnswerIndices;
                            }, []);
                        }

                        question.answers = question.answers!.map((answer: Answer) => {
                            if (answer.isCommentaryVisible) {
                                answer.commentary = answer.commentary;
                            }
                            else {
                                answer.commentary = undefined;
                            }
                            return answer;
                        });

                        return question;
                    });
                });
            }
        }).catch((error: any) => {
            console.error("Error fetching lesson:", error);
            this.router.navigate(["/home"]);
        });
    }

    getNextLessonId(): string {
        return this.course!.modules
            .map((module: Module) => module.lessons.map((lesson: Lesson) => lesson))
            .flat()
            .find((lesson: Lesson) => lesson.completed === false)?.id || this.course!.modules[0].lessons[0].id;
    }

    openActiveModule(): void {
        this.course!.modules.find((module: Module) => {
            return module.lessons.some((lesson: Lesson) => lesson.id == this.activeLessonId);
        })!.isOpened = true;
    }

    onAnswerSelected(question: Question, answer: Answer): void {
        if (question.type == "CHOICE") {
            question.answers.forEach((answer: Answer) => answer.correct = false);
        }
        answer.correct = !answer.correct;
    }

    completeLesson(): void {
        this.coursesService.completeLesson(this.courseId, this.activeLessonId).then(() => {
            this.course!.modules.forEach((module: Module) => {
                module.lessons.forEach((lesson: Lesson) => {
                    if (lesson.id == this.activeLessonId) {
                        lesson.completed = true;
                    }
                });
            });

            const totalLessons: number = this.course!.modules.reduce((total: number, module: Module) => {
                return total + module.lessons.length;
            }, 0);

            const completedLessons: number = this.course!.modules.reduce((total: number, module: Module) => {
                return total + module.lessons.reduce((moduleTotal: number, lesson: Lesson) => {
                    return moduleTotal + (lesson.completed ? 1 : 0);
                }, 0);
            }, 0);

            this.course!.progress = +((completedLessons / totalLessons) * 100).toFixed(1);
            this.animationFrame = Math.ceil(this.course!.progress / 10);

            this.activeLessonId = this.getNextLessonId();

            this.coursesService.getLesson(this.courseId, this.activeLessonId).then((lesson: Lesson) => {
                this.activeLesson = lesson;

                this.openActiveModule();

                if (this.activeLesson.type == "ARTICLE" && this.activeLesson.articleLink) {
                    this.coursesService.getLessonArticle(this.activeLesson.articleLink!).then(async (response: any) => {
                        const reader: ReadableStreamDefaultReader = (response.body as ReadableStream).getReader();
                        const chunks: Uint8Array[] = [];

                        let readResult: ReadableStreamReadResult<any> = await reader.read();
                        while (!readResult.done) {
                            if (readResult.value) {
                                chunks.push(readResult.value);
                            }

                            readResult = await reader.read();
                        }

                        const blob: Blob = new Blob(chunks, { type: "text/html" });
                        const text: string = await blob.text();
                        const parsedText: string = text.replaceAll("&nbsp;", " ");

                        this.activeLesson!.safeArticle = this.sanitizer.bypassSecurityTrustHtml(parsedText);
                    });
                }
            });
        });
    }
}
