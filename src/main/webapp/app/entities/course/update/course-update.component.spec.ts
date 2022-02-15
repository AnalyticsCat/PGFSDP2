import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { CourseService } from '../service/course.service';
import { ICourse, Course } from '../course.model';
import { ITeacher } from 'app/entities/teacher/teacher.model';
import { TeacherService } from 'app/entities/teacher/service/teacher.service';
import { ISubject } from 'app/entities/subject/subject.model';
import { SubjectService } from 'app/entities/subject/service/subject.service';

import { CourseUpdateComponent } from './course-update.component';

describe('Course Management Update Component', () => {
  let comp: CourseUpdateComponent;
  let fixture: ComponentFixture<CourseUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let courseService: CourseService;
  let teacherService: TeacherService;
  let subjectService: SubjectService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [CourseUpdateComponent],
      providers: [
        FormBuilder,
        {
          provide: ActivatedRoute,
          useValue: {
            params: from([{}]),
          },
        },
      ],
    })
      .overrideTemplate(CourseUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(CourseUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    courseService = TestBed.inject(CourseService);
    teacherService = TestBed.inject(TeacherService);
    subjectService = TestBed.inject(SubjectService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Teacher query and add missing value', () => {
      const course: ICourse = { id: 456 };
      const teacher: ITeacher = { id: 21789 };
      course.teacher = teacher;

      const teacherCollection: ITeacher[] = [{ id: 43077 }];
      jest.spyOn(teacherService, 'query').mockReturnValue(of(new HttpResponse({ body: teacherCollection })));
      const additionalTeachers = [teacher];
      const expectedCollection: ITeacher[] = [...additionalTeachers, ...teacherCollection];
      jest.spyOn(teacherService, 'addTeacherToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ course });
      comp.ngOnInit();

      expect(teacherService.query).toHaveBeenCalled();
      expect(teacherService.addTeacherToCollectionIfMissing).toHaveBeenCalledWith(teacherCollection, ...additionalTeachers);
      expect(comp.teachersSharedCollection).toEqual(expectedCollection);
    });

    it('Should call Subject query and add missing value', () => {
      const course: ICourse = { id: 456 };
      const subject: ISubject = { id: 12753 };
      course.subject = subject;

      const subjectCollection: ISubject[] = [{ id: 511 }];
      jest.spyOn(subjectService, 'query').mockReturnValue(of(new HttpResponse({ body: subjectCollection })));
      const additionalSubjects = [subject];
      const expectedCollection: ISubject[] = [...additionalSubjects, ...subjectCollection];
      jest.spyOn(subjectService, 'addSubjectToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ course });
      comp.ngOnInit();

      expect(subjectService.query).toHaveBeenCalled();
      expect(subjectService.addSubjectToCollectionIfMissing).toHaveBeenCalledWith(subjectCollection, ...additionalSubjects);
      expect(comp.subjectsSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const course: ICourse = { id: 456 };
      const teacher: ITeacher = { id: 4296 };
      course.teacher = teacher;
      const subject: ISubject = { id: 67148 };
      course.subject = subject;

      activatedRoute.data = of({ course });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(course));
      expect(comp.teachersSharedCollection).toContain(teacher);
      expect(comp.subjectsSharedCollection).toContain(subject);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Course>>();
      const course = { id: 123 };
      jest.spyOn(courseService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ course });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: course }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(courseService.update).toHaveBeenCalledWith(course);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Course>>();
      const course = new Course();
      jest.spyOn(courseService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ course });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: course }));
      saveSubject.complete();

      // THEN
      expect(courseService.create).toHaveBeenCalledWith(course);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Course>>();
      const course = { id: 123 };
      jest.spyOn(courseService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ course });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(courseService.update).toHaveBeenCalledWith(course);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Tracking relationships identifiers', () => {
    describe('trackTeacherById', () => {
      it('Should return tracked Teacher primary key', () => {
        const entity = { id: 123 };
        const trackResult = comp.trackTeacherById(0, entity);
        expect(trackResult).toEqual(entity.id);
      });
    });

    describe('trackSubjectById', () => {
      it('Should return tracked Subject primary key', () => {
        const entity = { id: 123 };
        const trackResult = comp.trackSubjectById(0, entity);
        expect(trackResult).toEqual(entity.id);
      });
    });
  });
});
