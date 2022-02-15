import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { ICourse, Course } from '../course.model';
import { CourseService } from '../service/course.service';
import { ITeacher } from 'app/entities/teacher/teacher.model';
import { TeacherService } from 'app/entities/teacher/service/teacher.service';
import { ISubject } from 'app/entities/subject/subject.model';
import { SubjectService } from 'app/entities/subject/service/subject.service';

@Component({
  selector: 'jhi-course-update',
  templateUrl: './course-update.component.html',
})
export class CourseUpdateComponent implements OnInit {
  isSaving = false;

  teachersSharedCollection: ITeacher[] = [];
  subjectsSharedCollection: ISubject[] = [];

  editForm = this.fb.group({
    id: [],
    name: [null, [Validators.required]],
    teacher: [],
    subject: [],
  });

  constructor(
    protected courseService: CourseService,
    protected teacherService: TeacherService,
    protected subjectService: SubjectService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ course }) => {
      this.updateForm(course);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const course = this.createFromForm();
    if (course.id !== undefined) {
      this.subscribeToSaveResponse(this.courseService.update(course));
    } else {
      this.subscribeToSaveResponse(this.courseService.create(course));
    }
  }

  trackTeacherById(index: number, item: ITeacher): number {
    return item.id!;
  }

  trackSubjectById(index: number, item: ISubject): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ICourse>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: () => this.onSaveSuccess(),
      error: () => this.onSaveError(),
    });
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(course: ICourse): void {
    this.editForm.patchValue({
      id: course.id,
      name: course.name,
      teacher: course.teacher,
      subject: course.subject,
    });

    this.teachersSharedCollection = this.teacherService.addTeacherToCollectionIfMissing(this.teachersSharedCollection, course.teacher);
    this.subjectsSharedCollection = this.subjectService.addSubjectToCollectionIfMissing(this.subjectsSharedCollection, course.subject);
  }

  protected loadRelationshipsOptions(): void {
    this.teacherService
      .query()
      .pipe(map((res: HttpResponse<ITeacher[]>) => res.body ?? []))
      .pipe(
        map((teachers: ITeacher[]) => this.teacherService.addTeacherToCollectionIfMissing(teachers, this.editForm.get('teacher')!.value))
      )
      .subscribe((teachers: ITeacher[]) => (this.teachersSharedCollection = teachers));

    this.subjectService
      .query()
      .pipe(map((res: HttpResponse<ISubject[]>) => res.body ?? []))
      .pipe(
        map((subjects: ISubject[]) => this.subjectService.addSubjectToCollectionIfMissing(subjects, this.editForm.get('subject')!.value))
      )
      .subscribe((subjects: ISubject[]) => (this.subjectsSharedCollection = subjects));
  }

  protected createFromForm(): ICourse {
    return {
      ...new Course(),
      id: this.editForm.get(['id'])!.value,
      name: this.editForm.get(['name'])!.value,
      teacher: this.editForm.get(['teacher'])!.value,
      subject: this.editForm.get(['subject'])!.value,
    };
  }
}
