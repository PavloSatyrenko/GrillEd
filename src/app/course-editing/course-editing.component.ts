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
import { ActivatedRoute, ParamMap, Router, RouterLink } from "@angular/router";
import { SkillPickerComponent } from "../skill-picker/skill-picker.component";
import { SkillsService } from "../services/skills.service";
import { Test } from "../../classes/Test";

@Component({
    selector: "app-course-editing",
    standalone: true,
    imports: [CommonModule, FormsModule, QuillModule, SkillPickerComponent, RouterLink],
    templateUrl: "./course-editing.component.html",
    styleUrl: "./course-editing.component.css"
})
export class CourseEditingComponent implements OnInit {
    user!: User;

    courseId: string = "";
    course: Course = new Course();

    isCourseSaveErrorVisible: boolean = false;

    @ViewChild("coursePhotoInput") coursePhotoInput!: ElementRef<HTMLInputElement>;
    coursePhotoPath: SafeResourceUrl | null = null;
    // isSizeValid: boolean = true;
    coursePhoto: File | null = null;

    initialCategories: Skill[] = [];
    categories: Skill[] = [];
    selectedCategory: Skill | null = null;

    moduleName: string = "";
    isModuleNameErrorVisible: boolean = false;

    @ViewChild("moduleNameInput") moduleNameInput!: ElementRef<HTMLInputElement>;

    isLessonPopupVisible: boolean = false;
    initialModule: Module = new Module();
    initialLesson: Lesson = new Lesson();
    lesson: Lesson = new Lesson();
    isLessonCreated: boolean = false;
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

    isLessonSaved: boolean = false;

    isSkillsPopupVisible: boolean = false;
    selectedSkills: Skill[] = [];
    initialSkills: Skill[] = [];

    private domSanitizer: DomSanitizer = inject(DomSanitizer);
    private activatedRoute: ActivatedRoute = inject(ActivatedRoute);
    private router: Router = inject(Router);
    private authService: AuthService = inject(AuthService);
    private coursesService: CoursesService = inject(CoursesService);
    private skillsService: SkillsService = inject(SkillsService);

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

                this.selectedCategory = this.course.category;
                this.selectedSkills = this.course.skills || [];
                this.initialSkills = JSON.parse(JSON.stringify(this.selectedSkills));

                console.log(this.course);
            }).catch((error: any) => {
                console.error("Error fetching course:", error);
                this.router.navigate(["/home"]);
            });
        })

        this.skillsService.getRootCategories().then((response: { categories: Skill[] }) => {
            this.initialCategories = response.categories;

            this.categories = this.initialCategories;
        });
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
                this.coursePhoto = file;
            }
        }
    }

    removePhoto(): void {
        this.coursePhotoPath = null;
        this.coursePhoto = null;
        this.coursePhotoInput.nativeElement.value = "";
    }

    addModule(): void {
        const newModule: Module = {
            id: "",
            name: "New module",
            number: 0,
            estimatedTime: 1,
            lessons: [],
            isOpened: false,
            isEditing: true,
            isNewModule: true,
            newLessonName: "",
            newLessonType: "ARTICLE",
            isLessonNameErrorVisible: false
        }

        this.course.modules.push(newModule);
        this.moduleName = newModule.name;

        setTimeout(() => {
            this.moduleNameInput.nativeElement.focus();
            this.moduleNameInput.nativeElement.select();
        }, 0);
    }

    isAddModuleButtonDisabled(): boolean {
        return this.course.modules.some((module: Module) => module.isEditing);
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

    editModule(module: Module): void {
        this.moduleName = module.name;
        module.isEditing = true;

        setTimeout(() => {
            this.moduleNameInput.nativeElement.focus();
            this.moduleNameInput.nativeElement.select();
        }, 0);
    }

    removeModule(module: Module): void {
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

    cancelModuleEditing(module: Module): void {
        module.isEditing = false;

        if (module.isNewModule) {
            const index: number = this.course.modules.indexOf(module);

            if (index != -1) {
                this.course.modules.splice(index, 1);
            }
        }
    }

    saveModule(module: Module): void {
        if (!this.moduleName.trim() || this.moduleName.trim().length < 5) {
            this.isModuleNameErrorVisible = true;
            return;
        }

        this.isModuleNameErrorVisible = false;

        module.name = this.moduleName.trim();

        if (module.isNewModule) {
            this.coursesService.createModule(this.courseId, module.name).then((response: Module) => {
                module.isEditing = false;
                module.isNewModule = false;
                module.id = response.id;
                module.number = response.number;
            });
        }
        else {
            this.coursesService.updateModule(this.courseId, module.id, module.name, module.number).then(() => {
                module.isEditing = false;
            });
        }
    }

    addLesson(module: Module): void {
        if (!module.newLessonName?.trim() || module.newLessonName?.trim().length < 5) {
            module.isLessonNameErrorVisible = true;
            return;
        }

        module.isLessonNameErrorVisible = false;

        const newLesson: Lesson = {
            id: "",
            name: module.newLessonName.trim(),
            number: module.lessons.length + 1,
            type: module.newLessonType!,
            estimatedTime: 1
        }

        this.markdown = "";
        this.isLessonCreated = true;
        this.initialModule = module;
        this.lesson = JSON.parse(JSON.stringify(newLesson));
        this.initialLesson = this.lesson;
        this.isLessonPopupVisible = true;
        document.body.style.overflow = "hidden";

        module.newLessonName = "";
        module.newLessonType = "ARTICLE";
    }

    removeLesson(lesson: Lesson, module: Module): void {
        this.coursesService.deleteLesson(this.courseId, lesson.id).then(() => {
            const index: number = module.lessons.indexOf(lesson);

            if (index != -1) {
                module.lessons.splice(index, 1);
            }
        });
    }

    editLesson(lesson: Lesson): void {
        this.initialLesson = lesson;
        this.markdown = "";
        this.isLessonCreated = false;
        this.isLessonSaveErrorVisible = false;

        this.coursesService.getLesson(this.courseId, lesson.id).then((response: Lesson) => {
            this.lesson = response;

            if (this.lesson.type == "ARTICLE") {
                if (this.lesson.articleLink) {
                    this.coursesService.getLessonArticle(this.lesson.articleLink).then(async (response: any) => {
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
                        this.markdown = await blob.text();

                        this.isLessonPopupVisible = true;
                        document.body.style.overflow = "hidden";
                    });
                }
            }
            else if (this.lesson.type == "VIDEO") {
                if (this.lesson.videoLink) {
                    this.coursesService.getLessonVideo(this.lesson.videoLink).then(async (response: any) => {
                        const reader: ReadableStreamDefaultReader = (response.body as ReadableStream).getReader();
                        const chunks: Uint8Array[] = [];

                        let readResult: ReadableStreamReadResult<any> = await reader.read();
                        while (!readResult.done) {
                            if (readResult.value) {
                                chunks.push(readResult.value);
                            }

                            readResult = await reader.read();
                        }

                        const blob: Blob = new Blob(chunks, { type: "video/mp4" });
                        this.setVideoPreviewPath(blob);

                        this.isLessonPopupVisible = true;
                        document.body.style.overflow = "hidden";
                    });
                }
            }
            else if (this.lesson.type == "TEST") {
                if (this.lesson.test) {
                    this.coursesService.getTestQuestions(this.courseId, this.lesson.test!.id).then((test: Test) => {
                        this.lesson.questions = test.questions;

                        this.lesson.questions.forEach((question: Question) => {
                            question.answers.forEach((answer: Answer) => {
                                if (question.type == "CHOICE") {
                                    answer.correct = question.rightAnswer == answer.id;
                                }
                                else if (question.type == "MULTICHOICE") {
                                    answer.correct = (question.rightAnswers as string[]).includes(answer.id);
                                }

                                answer.text = answer.answer!;
                                answer.isCommentaryVisible = !!answer.commentary;
                            });
                        });

                        this.isLessonPopupVisible = true;
                        document.body.style.overflow = "hidden";
                    });
                }
            }
        });
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

                this.setVideoPreviewPath(file);

                this.video = file;
            }
        }
    }

    setVideoPreviewPath(file: File | Blob): void {
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
                this.lesson.lessonVideoPreviewPath = canvas.toDataURL("image/png");
                URL.revokeObjectURL(video.src);
            }
        });
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
            return !this.lesson.lessonVideoPreviewPath;
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

        this.initialLesson.name = this.lesson.name.trim();
        this.initialLesson.type = this.lesson.type;
        this.initialLesson.estimatedTime = +this.lesson.estimatedTime;

        if (this.lesson.type == "ARTICLE") {
            this.initialLesson.article = this.markdown;
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

            if (this.lesson.questions!.some((question: Question) => this.isAllAnswersIncorrect(question))) {
                this.isLessonSaveErrorVisible = true;
                return;
            }

            this.initialLesson.questions = this.lesson.questions;
        }

        if (this.isLessonSaved) {
            return;
        }

        this.isLessonSaved = true;

        if (this.isLessonCreated) {
            this.coursesService.createLesson(this.courseId, this.initialModule.id, this.initialLesson)
                .then((response: Lesson) => {
                    if (this.lesson.type == "VIDEO") {
                        const formData: FormData = new FormData();
                        formData.append("video", this.video!);

                        this.coursesService.uploadLessonVideo(this.courseId, response.id, formData)
                            .then((response: Lesson) => {
                                this.initialModule.lessons.push(response);

                                this.isLessonPopupVisible = false;
                                document.body.style.overflow = "";
                            }).finally(() => this.isLessonSaved = false);
                    }
                    else {
                        this.initialModule.lessons.push(response);

                        this.isLessonSaved = false;
                        this.isLessonPopupVisible = false;
                        document.body.style.overflow = "";
                    }
                }).catch((error: any) => {
                    console.error("Error creating lesson:", error);
                    this.isLessonSaved = false;
                });
        }
        else {
            this.coursesService.updateLesson(this.courseId, this.initialLesson.id, this.initialLesson)
                .then((response: Lesson) => {
                    if (this.lesson.type == "VIDEO") {
                        const formData: FormData = new FormData();
                        formData.append("video", this.video!);

                        this.coursesService.uploadLessonVideo(this.courseId, response.id, formData).then((response: Lesson) => {
                            this.initialModule.lessons[this.initialModule.lessons.map((lesson: Lesson) => lesson.id).indexOf(response.id)] = response;

                            this.isLessonPopupVisible = false;
                            document.body.style.overflow = "";
                        }).finally(() => this.isLessonSaved = false);
                    }
                    else if (this.lesson.type == "ARTICLE") {
                        this.coursesService.updateLessonArticle(this.courseId, response.id, this.initialLesson.article!)
                            .then((response: Lesson) => {
                                this.initialModule.lessons[this.initialModule.lessons.map((lesson: Lesson) => lesson.id).indexOf(response.id)] = response;

                                this.isLessonPopupVisible = false;
                                document.body.style.overflow = "";
                            }).finally(() => this.isLessonSaved = false);
                    }
                    else {
                        this.isLessonPopupVisible = false;
                        document.body.style.overflow = "";
                        this.isLessonSaved = false;
                    }
                }).catch((error: any) => {
                    console.error("Error creating lesson:", error);
                    this.isLessonSaved = false;
                });
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
        this.course.skills = this.selectedSkills;

        this.isSkillsPopupVisible = false;
        document.body.style.overflow = "";
    }

    saveCourse(): void {
        this.isCourseSaveErrorVisible = false;

        if (!this.course.name.trim() || this.course.name.trim().length < 5) {
            this.isCourseSaveErrorVisible = true;
            return;
        }

        if (!this.course.about.trim()) {
            this.isCourseSaveErrorVisible = true;
            return;
        }

        if (!this.selectedCategory) {
            this.isCourseSaveErrorVisible = true;
            return;
        }

        const newCourse: { name: string, about: string, categoryId: string, level: "BEGINNER" | "INTERMEDIATE" | "EXPERT" } = {
            name: this.course.name.trim(),
            about: this.course.about.trim(),
            categoryId: this.selectedCategory.id,
            level: this.course.level
        }

        this.coursesService.updateCourse(this.course.id, newCourse).then(() => {
            let skillsUploaded: boolean = false;
            let photoUploaded: boolean = false;

            if (this.initialSkills.length) {
                const skillsIds: string[] = this.initialSkills.map((skill: Skill) => skill.id);

                this.coursesService.detachSkills(this.course.id, skillsIds).then(() => {
                    if (this.course.skills && this.course.skills.length > 0) {
                        const skillsIds: string[] = this.course.skills.map((skill: Skill) => skill.id);

                        this.coursesService.attachSkills(this.course.id, skillsIds).then(() => {
                            skillsUploaded = true;

                            if (this.coursePhoto && photoUploaded) {
                                this.router.navigate(["/course", this.course.id]);
                            }
                            else {
                                this.router.navigate(["/course", this.course.id]);
                            }
                        });
                    }
                    else {
                        if (this.coursePhoto && photoUploaded) {
                            this.router.navigate(["/course", this.course.id]);
                        }
                        else {
                            this.router.navigate(["/course", this.course.id]);
                        }
                    }
                });
            }
            else if (this.course.skills && this.course.skills.length > 0) {
                const skillsIds: string[] = this.course.skills.map((skill: Skill) => skill.id);

                this.coursesService.attachSkills(this.course.id, skillsIds).then(() => {
                    skillsUploaded = true;

                    if (this.coursePhoto && photoUploaded) {
                        this.router.navigate(["/course", this.course.id]);
                    }
                    else {
                        this.router.navigate(["/course", this.course.id]);
                    }
                });
            }

            if (this.coursePhoto) {
                const formData: FormData = new FormData();
                formData.append("avatar", this.coursePhoto!);

                this.coursesService.updateCoursePhoto(this.course.id, formData).then(() => {
                    photoUploaded = true;

                    if (this.course.skills && this.course.skills.length > 0 && skillsUploaded) {
                        this.router.navigate(["/course", this.course.id]);
                    }
                    else {
                        this.router.navigate(["/course", this.course.id]);
                    }
                });
            }

            if (!this.coursePhoto && !this.initialSkills.length && !(this.course.skills && this.course.skills.length > 0)) {
                this.router.navigate(["/course", this.course.id]);
            }
        });
    }
}   
