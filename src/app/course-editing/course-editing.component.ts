import { Component, ElementRef, inject, OnInit, ViewChild } from "@angular/core";
import { Course } from "../../classes/Course";
import { AuthService } from "../services/auth.service";
import { User } from "../../classes/User";
import { CommonModule } from "@angular/common";
import { QuillModule, QuillModules } from "ngx-quill";
import { DomSanitizer, SafeResourceUrl } from "@angular/platform-browser";
import { FormsModule } from "@angular/forms";
import { Module } from "../../classes/Module";
import { Skill } from "../../classes/Skill";
import { Lesson } from "../../classes/Lesson";
import { Answer } from "../../classes/Answer";
import { Question } from "../../classes/Question";
import Quill from "quill";
import { CoursesService } from "../services/courses.service";
import { ActivatedRoute, ParamMap } from "@angular/router";
import { SkillPickerComponent } from "../skill-picker/skill-picker.component";

@Component({
    selector: "app-course-editing",
    standalone: true,
    imports: [CommonModule, FormsModule, QuillModule, SkillPickerComponent],
    templateUrl: "./course-editing.component.html",
    styleUrl: "./course-editing.component.css"
})
export class CourseEditingComponent implements OnInit {
    user!: User;

    courseId: string = "";
    course: Course = new Course();

    @ViewChild("coursePhotoInput") coursePhotoInput!: ElementRef<HTMLInputElement>;
    coursePhotoPath: SafeResourceUrl | null = null;
    // isSizeValid: boolean = true;

    initialCategories: Skill[] = [];
    categories: Skill[] = [];
    selectedCategory: Skill | null = null;

    moduleName: string = "";
    isModuleNameErrorVisible: boolean = false;

    isLessonPopupVisible: boolean = false;
    initialLesson: Lesson = new Lesson();
    lesson: Lesson = new Lesson();
    isLessonNameErrorVisible: boolean = false;
    isLessonSaveErrorVisible: boolean = false;

    markdown: string = "";
    quillModules: QuillModules = {
        toolbar: [
            ["bold", "italic", "underline", "strike"],
            [{ header: [1, 2, 3, 4, 5, 6, false] }],
            [{ align: "" }, { align: "center" }, { align: "right" }],
            [{ indent: "-1" }, { indent: "+1" }],
            ["blockquote", "code-block"],
            [{ list: "ordered" }, { list: "bullet" }],
            ["clean"]
        ]
    }
    quillInstance: Quill | null = null;

    lessonVideoPreviewPath: string | null = null;
    video: File | null = null;

    isSkillsPopupVisible: boolean = false;
    skills: Skill[] = [];
    selectedSkills: Skill[] = [];

    private domSanitizer: DomSanitizer = inject(DomSanitizer);
    private activatedRoute: ActivatedRoute = inject(ActivatedRoute);
    private authService: AuthService = inject(AuthService);
    private coursesService: CoursesService = inject(CoursesService);

    ngOnInit(): void {
        this.user = this.authService.user!;

        this.activatedRoute.paramMap.subscribe((params: ParamMap) => {
            this.courseId = params.get("id")!;

            this.coursesService.getCourse(this.courseId).then((course: Course) => {
                this.course = course;

                this.course.modules.forEach((module: Module) => {
                    module.isOpened = false;
                    module.isEditing = false;
                    module.newLessonName = "";
                    module.newLessonType = "ARTICLE";
                    module.isLessonNameErrorVisible = false;

                    module.lessons.forEach((lesson: Lesson) => {
                        lesson.questions?.forEach((question: Question) => {
                            question.answers.forEach((answer: Answer) => {
                                answer.isCommentaryVisible = !!answer.commentary;
                            });
                        });
                    });
                });
            });
        });

        this.course.author = {
            id: this.user.id,
            name: this.user.name,
            surname: this.user.surname,
            avatar: this.user.avatar
        };

        this.course.modules = [{
            id: "1",
            name: "Module 1",
            number: 1,
            estimatedTime: 5,
            lessons: [{
                id: "1",
                name: "Lesson 1",
                number: 1,
                type: "VIDEO",
                estimatedTime: 2
            }, {
                id: "2",
                name: "Lesson 2",
                number: 2,
                type: "ARTICLE",
                estimatedTime: 3
            }, {
                id: "3",
                name: "Lesson 3",
                number: 3,
                type: "TEST",
                questions: [{
                    id: "d8eb023e-8272-4b6a-b21a-1d77628a6e84",
                    lesson_id: "3",
                    text: "Question 1",
                    type: "CHOICE",
                    answers: [{
                        id: "1",
                        question_id: "1",
                        text: "Answer 1",
                        commentary: "Commentary 1",
                        correct: false
                    }, {
                        id: "2",
                        question_id: "1",
                        text: "Answer 2",
                        correct: true
                    }]
                }, {
                    id: "2",
                    lesson_id: "3",
                    text: "Question 2",
                    type: "MULTICHOICE",
                    answers: [{
                        id: "3",
                        question_id: "2",
                        text: "Answer 1",
                        correct: false
                    }, {
                        id: "4",
                        question_id: "2",
                        text: "Answer 2",
                        correct: true
                    }, {
                        id: "5",
                        question_id: "2",
                        text: "Answer 3",
                        commentary: "Commentary 3",
                        correct: true
                    }]
                }],
                estimatedTime: 5
            }]
        }, {
            id: "2",
            name: "Module 2",
            number: 2,
            estimatedTime: 20,
            lessons: [{
                id: "1",
                name: "Lesson 1",
                number: 1,
                type: "VIDEO",
                estimatedTime: 2
            }, {
                id: "2",
                name: "Lesson 2",
                number: 2,
                type: "ARTICLE",
                estimatedTime: 3
            }]
        }];

        this.initialCategories = [
            { id: "3dfc9ec3-2ef7-4e8a-ae2c-91f409ff003f", name: "JavaScript" },
            { id: "b1ad9122-fdf9-455b-a9c7-f1191183ce63", name: "Python" },
            { id: "a4d11ec2-b5b1-42dc-bd6c-ded6fbbd7d98", name: "Java" },
            { id: "f8f0a003-b7bb-4447-8690-40df401d5c9f", name: "C#" },
            { id: "1d154a0c-1970-43f6-a7c3-e6fa11dd1582", name: "C++" },
            { id: "d6117717-d105-4933-8fd9-fb845bb5a2e1", name: "Ruby" },
            { id: "0e028a59-6830-45d2-b4b1-9e07d25372c4", name: "PHP" },
            { id: "40aaee74-6bcb-4219-84ec-3650a7c96b7b", name: "Swift" },
            { id: "80b3795d-99ad-4fef-ae14-9fa72926079d", name: "Go" },
            { id: "98fe6d70-34e7-4e47-9cc3-84e021ae8d6a", name: "Kotlin" },
            { id: "36bc01fc-d3ff-404e-bc93-cdc6a8e6a0f6", name: "TypeScript" },
            { id: "68d92b0b-58eb-4b71-95b4-cf70e27825df", name: "Rust" },
            { id: "0cb20b06-01f0-444e-83b7-75f2d00dc5b1", name: "Dart" },
            { id: "8f01f5ae-bc77-4b6b-91ee-8024f3b4015c", name: "Scala" },
            { id: "2ae32ff5-123b-4ae8-90e1-fc107649d8cd", name: "Haskell" },
            { id: "cbbf29e3-f2c0-41c0-bbde-6e1a22e48df8", name: "Elixir" },
            { id: "f69b785c-3937-4403-b80d-b4b77b107373", name: "Clojure" },
            { id: "e94c7dc5-e6bc-4059-a949-503e8eea48f5", name: "Shell" },
            { id: "e3a95c12-fb87-4f8b-bcdc-099c18969c07", name: "HTML" },
            { id: "b5ab222c-50dc-4931-9e97-c390a7e38929", name: "CSS" },
            { id: "fe636d2f-4f69-4643-9b89-f06ae6b105e1", name: "SQL" },
            { id: "81ad5e38-3143-4a8d-8bb1-08d7f0fbe34b", name: "NoSQL" },
            { id: "b0b5ad97-0c4b-48e6-a8a1-476f507fe279", name: "GraphQL" },
            { id: "92f4c7cb-cd76-4623-a7b1-9b4f85a73804", name: "Firebase" },
            { id: "3c0bbf24-bbab-4f47-b6b7-0e5d9c720650", name: "AWS" },
            { id: "f37f289b-df8b-4f93-b9e7-4f1656b5e6b4", name: "Azure" },
            { id: "18bbdf0a-d6f4-4d25-844a-f15528580f88", name: "Google Cloud" },
            { id: "6b30182c-4bb2-4308-b57f-c7aa327b540e", name: "Docker" },
            { id: "73e49a6f-17b6-48e1-bbf6-15b9f9d3872c", name: "Kubernetes" },
            { id: "aaedce70-cab6-4520-a3d3-ff75a28919bb", name: "Terraform" },
            { id: "b38a2326-efc6-429f-b4f2-d2f3016cfb6b", name: "Ansible" },
            { id: "61a99f53-7a70-470e-a8f4-2d5adcfba9d2", name: "Chef" },
            { id: "6259dc94-7c2f-4306-8419-29b26f999726", name: "Puppet" },
            { id: "0fc18893-3731-44b7-b4a1-83c4e3b5b107", name: "Jenkins" },
            { id: "2a37417f-c5d0-41ee-838a-56aa116205f7", name: "Git" },
            { id: "9e4740c3-2624-470f-9d8a-f5b7a5d3b251", name: "SVN" },
            { id: "70e6b0cc-f2e3-426f-bb8d-55fe12ae61d8", name: "Mercurial" },
            { id: "d1e7f85f-3b7c-4b53-a6d0-263c07a7c6c8", name: "Bitbucket" },
            { id: "17b79d6e-25ce-43ce-bd36-92e6fda36c09", name: "GitHub" },
            { id: "ad510b2c-fdfa-4bc1-97e9-635e1c90f1a2", name: "GitLab" },
            { id: "ba43cb64-b53f-4435-90cb-eab3a83dbb39", name: "Jira" },
            { id: "5bcbf8e1-c24d-4f40-a7c7-064aad69ae32", name: "Trello" },
            { id: "71fd3a34-9e0c-4fc4-8989-dcfbe95ff9d8", name: "Slack" },
            { id: "0e3ff158-b83f-4bb3-b430-837e37e93a63", name: "Zoom" },
            { id: "d1ff894e-98b7-4e89-a3a7-c00b6c1d9313", name: "Microsoft Teams" },
            { id: "a3d8f2c2-7be4-44cf-b27a-9e2bb16484d2", name: "Discord" },
            { id: "f0d524a7-6e95-45a3-92d4-64c3e3e9e07b", name: "Skype" },
            { id: "3f6348f7-d9dc-4b56-90f2-9f661b5b3e6e", name: "WhatsApp" },
            { id: "cce15a7d-4f1e-45fc-bbc3-91e8324f2a4e", name: "Telegram" },
            { id: "d3aeae61-9a10-404f-bf3c-7de85e18f00a", name: "Signal" },
            { id: "8ae5980e-62cf-4ae1-9233-09e71c3dfcd8", name: "Viber" },
            { id: "a618c0db-8a1a-4c25-9f64-6794e5417335", name: "WeChat" }
        ];

        this.categories = this.initialCategories;

        this.skills = [
            { id: "3dfc9ec3-2ef7-4e8a-ae2c-91f409ff003f", name: "JavaScript" },
            { id: "b1ad9122-fdf9-455b-a9c7-f1191183ce63", name: "Python" },
            { id: "a4d11ec2-b5b1-42dc-bd6c-ded6fbbd7d98", name: "Java" },
            { id: "f8f0a003-b7bb-4447-8690-40df401d5c9f", name: "C#" },
            { id: "1d154a0c-1970-43f6-a7c3-e6fa11dd1582", name: "C++" },
            { id: "d6117717-d105-4933-8fd9-fb845bb5a2e1", name: "Ruby" },
            { id: "0e028a59-6830-45d2-b4b1-9e07d25372c4", name: "PHP" },
            { id: "40aaee74-6bcb-4219-84ec-3650a7c96b7b", name: "Swift" },
            { id: "80b3795d-99ad-4fef-ae14-9fa72926079d", name: "Go" },
            { id: "98fe6d70-34e7-4e47-9cc3-84e021ae8d6a", name: "Kotlin" },
            { id: "36bc01fc-d3ff-404e-bc93-cdc6a8e6a0f6", name: "TypeScript" },
            { id: "68d92b0b-58eb-4b71-95b4-cf70e27825df", name: "Rust" },
            { id: "0cb20b06-01f0-444e-83b7-75f2d00dc5b1", name: "Dart" },
            { id: "8f01f5ae-bc77-4b6b-91ee-8024f3b4015c", name: "Scala" },
            { id: "2ae32ff5-123b-4ae8-90e1-fc107649d8cd", name: "Haskell" },
            { id: "cbbf29e3-f2c0-41c0-bbde-6e1a22e48df8", name: "Elixir" },
            { id: "f69b785c-3937-4403-b80d-b4b77b107373", name: "Clojure" },
            { id: "e94c7dc5-e6bc-4059-a949-503e8eea48f5", name: "Shell" },
            { id: "e3a95c12-fb87-4f8b-bcdc-099c18969c07", name: "HTML" },
            { id: "b5ab222c-50dc-4931-9e97-c390a7e38929", name: "CSS" },
            { id: "fe636d2f-4f69-4643-9b89-f06ae6b105e1", name: "SQL" },
            { id: "81ad5e38-3143-4a8d-8bb1-08d7f0fbe34b", name: "NoSQL" },
            { id: "b0b5ad97-0c4b-48e6-a8a1-476f507fe279", name: "GraphQL" },
            { id: "92f4c7cb-cd76-4623-a7b1-9b4f85a73804", name: "Firebase" },
            { id: "3c0bbf24-bbab-4f47-b6b7-0e5d9c720650", name: "AWS" },
            { id: "f37f289b-df8b-4f93-b9e7-4f1656b5e6b4", name: "Azure" },
            { id: "18bbdf0a-d6f4-4d25-844a-f15528580f88", name: "Google Cloud" },
            { id: "6b30182c-4bb2-4308-b57f-c7aa327b540e", name: "Docker" },
            { id: "73e49a6f-17b6-48e1-bbf6-15b9f9d3872c", name: "Kubernetes" },
            { id: "aaedce70-cab6-4520-a3d3-ff75a28919bb", name: "Terraform" },
            { id: "b38a2326-efc6-429f-b4f2-d2f3016cfb6b", name: "Ansible" },
            { id: "61a99f53-7a70-470e-a8f4-2d5adcfba9d2", name: "Chef" },
            { id: "6259dc94-7c2f-4306-8419-29b26f999726", name: "Puppet" },
            { id: "0fc18893-3731-44b7-b4a1-83c4e3b5b107", name: "Jenkins" },
            { id: "2a37417f-c5d0-41ee-838a-56aa116205f7", name: "Git" },
            { id: "9e4740c3-2624-470f-9d8a-f5b7a5d3b251", name: "SVN" },
            { id: "70e6b0cc-f2e3-426f-bb8d-55fe12ae61d8", name: "Mercurial" },
            { id: "d1e7f85f-3b7c-4b53-a6d0-263c07a7c6c8", name: "Bitbucket" },
            { id: "17b79d6e-25ce-43ce-bd36-92e6fda36c09", name: "GitHub" },
            { id: "ad510b2c-fdfa-4bc1-97e9-635e1c90f1a2", name: "GitLab" },
            { id: "ba43cb64-b53f-4435-90cb-eab3a83dbb39", name: "Jira" },
            { id: "5bcbf8e1-c24d-4f40-a7c7-064aad69ae32", name: "Trello" },
            { id: "71fd3a34-9e0c-4fc4-8989-dcfbe95ff9d8", name: "Slack" },
            { id: "0e3ff158-b83f-4bb3-b430-837e37e93a63", name: "Zoom" },
            { id: "d1ff894e-98b7-4e89-a3a7-c00b6c1d9313", name: "Microsoft Teams" },
            { id: "a3d8f2c2-7be4-44cf-b27a-9e2bb16484d2", name: "Discord" },
            { id: "f0d524a7-6e95-45a3-92d4-64c3e3e9e07b", name: "Skype" },
            { id: "3f6348f7-d9dc-4b56-90f2-9f661b5b3e6e", name: "WhatsApp" },
            { id: "cce15a7d-4f1e-45fc-bbc3-91e8324f2a4e", name: "Telegram" },
            { id: "d3aeae61-9a10-404f-bf3c-7de85e18f00a", name: "Signal" },
            { id: "8ae5980e-62cf-4ae1-9233-09e71c3dfcd8", name: "Viber" },
            { id: "a618c0db-8a1a-4c25-9f64-6794e5417335", name: "WeChat" }
        ];
    }

    onPhotoUpload(event: EventTarget | null): void {
        if (event instanceof HTMLInputElement) {
            const file: File | undefined = event.files?.[0];

            if (file) {
                // if (file.size > 2 * 1024 * 1024) {
                //     this.removePhoto();
                //     this.isSizeValid = false;
                //     return;
                // }

                this.coursePhotoPath = this.domSanitizer.bypassSecurityTrustResourceUrl(URL.createObjectURL(file));
            }
        }
    }

    removePhoto(): void {
        this.coursePhotoPath = null;
        this.coursePhotoInput.nativeElement.value = "";
    }

    addModule(): void {
        this.coursesService.createModule(this.courseId, "New module").then((response: Module) => {
            this.course.modules.push(response);
            this.editModule(new MouseEvent(""), response);
        });
    }

    toggleModule(module: Module): void {
        module.isOpened = !module.isOpened;

        module.newLessonName = "";
        module.newLessonType = "ARTICLE";
        module.isLessonNameErrorVisible = false;
    }

    editModule(event: MouseEvent, module: Module): void {
        event.stopPropagation();

        this.moduleName = module.name;
        module.isEditing = true;
    }

    removeModule(event: MouseEvent, module: Module): void {
        event.stopPropagation();

        this.coursesService.deleteModule(this.courseId, module.id).then(() => {
            const index: number = this.course.modules.indexOf(module);

            if (index != -1) {
                this.course.modules.splice(index, 1);
            }
        });
    }

    isEditModuleButtonDisabled(): boolean {
        return this.course.modules.some((module: Module) => module.isEditing);
    }

    cancelModuleEditing(event: MouseEvent, module: Module): void {
        event.stopPropagation();

        module.isEditing = false;
    }

    saveModule(event: MouseEvent, module: Module): void {
        event.stopPropagation();

        if (!this.moduleName.trim()) {
            this.isModuleNameErrorVisible = true;
            return;
        }

        this.isModuleNameErrorVisible = false;

        module.name = this.moduleName.trim();

        module.isEditing = false;
    }

    addLesson(module: Module): void {
        if (!module.newLessonName?.trim()) {
            module.isLessonNameErrorVisible = true;
            return;
        }

        module.isLessonNameErrorVisible = false;

        const newLesson: Lesson = {
            id: "",
            name: module.newLessonName.trim(),
            number: module.lessons.length + 1,
            type: module.newLessonType!,
            estimatedTime: 0
        }

        this.coursesService.createLesson(this.courseId, module.id, newLesson).then((response: Lesson) => {
            module.lessons.push(response);

            module.newLessonName = "";
            module.newLessonType = "ARTICLE";
        });
    }

    removeLesson(lesson: Lesson, module: Module): void {
        const index: number = module.lessons.indexOf(lesson);

        if (index != -1) {
            module.lessons.splice(index, 1);
        }
    }

    editLesson(lesson: Lesson): void {
        this.initialLesson = lesson;
        this.lesson = JSON.parse(JSON.stringify(lesson));

        this.isLessonPopupVisible = true;
        document.body.style.overflow = "hidden";

        if (lesson.type == "ARTICLE") {
            // this.markdown = lesson.content || "";
            this.markdown = "";
        }
        else if (lesson.type == "VIDEO") {
            // this.lessonVideoPreviewPath = lesson.videoPreviewPath || null;
            this.lessonVideoPreviewPath = null;
        }
        else if (lesson.type == "TEST") {
            this.lesson.questions = lesson.questions || [];

            this.lesson.questions.forEach((question: Question) => {
                question.answers.forEach((answer: Answer) => {
                    answer.isCommentaryVisible = !!answer.commentary;
                });
            });
        }
    }

    onEditorCreated(quill: Quill): void {
        this.quillInstance = quill;
    }

    onVideoUpload(event: EventTarget | null): void {
        if (event instanceof HTMLInputElement) {
            const file: File | undefined = event.files?.[0];

            if (file) {
                // if (file.size > 100 * 1024 * 1024) {
                //     this.removeVideo();
                //     this.isSizeValid = false;
                //     return;
                // }

                const video: HTMLVideoElement = document.createElement("video");
                video.src = URL.createObjectURL(file);
                video.muted = true;
                video.playsInline = true;

                video.addEventListener("loadeddata", () => {
                    video.currentTime = 0.1;
                });

                video.addEventListener("seeked", () => {
                    const canvas: HTMLCanvasElement = document.createElement("canvas");
                    canvas.width = video.videoWidth;
                    canvas.height = video.videoHeight;

                    const context: CanvasRenderingContext2D | null = canvas.getContext("2d");

                    if (context) {
                        context.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
                        this.lessonVideoPreviewPath = canvas.toDataURL("image/png");
                        URL.revokeObjectURL(video.src);
                    }
                });

                this.video = file;
            }
        }
    }

    setQuestionType(question: Question, event: Event): void {
        question.type = (event.target as HTMLSelectElement).value as "CHOICE" | "MULTICHOICE";

        if (question.type == "CHOICE") {
            const correctAnswersAmount: number = question.answers.filter((answer: Answer) => answer.correct).length;

            if (correctAnswersAmount > 1) {
                const correctAnswer: Answer = question.answers.find((answer: Answer) => answer.correct)!;

                question.answers.forEach((answer: Answer) => {
                    if (answer != correctAnswer) {
                        answer.correct = false;
                    }
                });
            }
            else if (correctAnswersAmount == 0) {
                question.answers[0].correct = true;
            }
        }
    }

    removeQuestion(question: Question): void {
        const index: number = this.lesson.questions!.indexOf(question);

        if (index != -1) {
            this.lesson.questions!.splice(index, 1);
        }
    }

    toggleAnswerCommentary(answer: Answer): void {
        answer.isCommentaryVisible = !answer.isCommentaryVisible;
    }

    removeAnswer(question: Question, answer: Answer): void {
        const index: number = question.answers.indexOf(answer);

        if (index != -1) {
            question.answers.splice(index, 1);

            if (question.type == "CHOICE") {
                if (question.answers.length == 0) {
                    this.addAnswer(question);
                }
                else {
                    const correctAnswersAmount: number = question.answers.filter((answer: Answer) => answer.correct).length;

                    if (correctAnswersAmount == 0) {
                        question.answers[0].correct = true;
                    }
                }
            }
            else if (question.type == "MULTICHOICE") {
                if (question.answers.length == 0) {
                    this.addAnswer(question);
                }
            }
        }
    }

    setCorrectAnswer(question: Question, answer: Answer): void {
        if (question.type == "CHOICE") {
            question.answers.forEach((answer: Answer) => answer.correct = false);
        }
        answer.correct = !answer.correct;
    }

    addAnswer(question: Question): void {
        const newAnswer: Answer = {
            id: "",
            question_id: question.id,
            text: "",
            commentary: "",
            correct: false,
            isCommentaryVisible: false
        }

        if (question.type == "CHOICE" && question.answers.length == 0) {
            newAnswer.correct = true;
        }

        question.answers.push(newAnswer);
    }

    addQuestion(): void {
        const newQuestion: Question = {
            id: "",
            lesson_id: this.lesson.id,
            text: "",
            type: "CHOICE",
            answers: [],
        }

        if (!this.lesson.questions) {
            this.lesson.questions = [];
        }

        this.lesson.questions?.push(newQuestion);

        this.addAnswer(newQuestion);
    }

    closeLessonPopup(): void {
        this.isLessonPopupVisible = false;
        document.body.style.overflow = "";
    }

    isSaveLessonButtonDisabled(): boolean {
        if (this.lesson.type == "TEST") {
            return !this.lesson.questions || this.lesson.questions.length == 0;
        }
        else if (this.lesson.type == "VIDEO") {
            return !this.lessonVideoPreviewPath;
        }
        else if (this.lesson.type == "ARTICLE") {
            return this.quillInstance?.getText().trim().length == 0;
        }

        return false;
    }

    isAllAnswersIncorrect(question: Question): boolean {
        return question.answers.every((answer: Answer) => !answer.correct);
    }

    saveLesson(): void {
        this.isLessonNameErrorVisible = false;
        this.isLessonSaveErrorVisible = false;

        if (!this.lesson.name?.trim()) {
            this.isLessonNameErrorVisible = true;
            return;
        }

        if (this.lesson.type == "ARTICLE") {
            // this.initialLesson.content = this.markdown;
            this.initialLesson.name = this.lesson.name.trim();
            this.initialLesson.type = this.lesson.type;

            this.isLessonPopupVisible = false;
            document.body.style.overflow = "";
            this.initialLesson.estimatedTime = this.lesson.estimatedTime;
        }
        else if (this.lesson.type == "VIDEO") {
            this.coursesService.uploadLessonVideo(this.courseId, this.lesson.id, this.video!).then((response: Lesson) => {
                this.initialLesson.videoLink = response.videoLink;

                this.initialLesson.name = this.lesson.name.trim();
                this.initialLesson.type = this.lesson.type;
                this.initialLesson.estimatedTime = this.lesson.estimatedTime;

                this.isLessonPopupVisible = false;
                document.body.style.overflow = "";
            });
        }
        else if (this.lesson.type == "TEST") {
            if (this.lesson.questions!.map((question: Question) => question.text).some((text: string) => !text.trim())) {
                this.isLessonSaveErrorVisible = true;
                return;
            }

            if (this.lesson.questions!.map((question: Question) => question.answers.map((answer: Answer) => answer.text)).flat().some((text: string) => !text.trim())) {
                this.isLessonSaveErrorVisible = true;
                return;
            }

            if (this.lesson.questions!.map((question: Question) => question.answers.every((answer: Answer) => !answer.correct)).includes(true)) {
                this.isLessonSaveErrorVisible = true;
                return;
            }

            this.initialLesson.questions = this.lesson.questions;

            this.initialLesson.name = this.lesson.name.trim();
            this.initialLesson.type = this.lesson.type;

            this.isLessonPopupVisible = false;
            document.body.style.overflow = "";
            this.initialLesson.estimatedTime = this.lesson.estimatedTime;
        }
    }

    filterCategories(target: EventTarget | null): void {
        if (!target || !(target instanceof HTMLInputElement)) {
            return;
        }

        const filter: string = target.value.toLowerCase();

        if (filter) {
            this.categories = this.initialCategories.filter((category: Skill) => category.name.toLowerCase().includes(filter));
        }
        else {
            this.categories = this.initialCategories;
        }
    }

    selectCategory(category: Skill): void {
        this.selectedCategory = category;
    }

    openSkillsPopup(): void {
        this.isSkillsPopupVisible = true;
        document.body.style.overflow = "hidden";
    }

    closeSkillsPopup(): void {
        this.isSkillsPopupVisible = false;
        document.body.style.overflow = "";
    }

    saveSkills(): void {
        this.isSkillsPopupVisible = false;
        document.body.style.overflow = "";
    }

    saveCourse(): void {

    }
}   
