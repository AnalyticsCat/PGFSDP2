import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'student',
        data: { pageTitle: 'Students' },
        loadChildren: () => import('./student/student.module').then(m => m.StudentModule),
      },
      {
        path: 'teacher',
        data: { pageTitle: 'Teachers' },
        loadChildren: () => import('./teacher/teacher.module').then(m => m.TeacherModule),
      },
      {
        path: 'subject',
        data: { pageTitle: 'Subjects' },
        loadChildren: () => import('./subject/subject.module').then(m => m.SubjectModule),
      },
      {
        path: 'course',
        data: { pageTitle: 'Courses' },
        loadChildren: () => import('./course/course.module').then(m => m.CourseModule),
      },
      /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
    ]),
  ],
})
export class EntityRoutingModule {}
