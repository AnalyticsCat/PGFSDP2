import { ITeacher } from 'app/entities/teacher/teacher.model';
import { ISubject } from 'app/entities/subject/subject.model';
import { IStudent } from 'app/entities/student/student.model';

export interface ICourse {
  id?: number;
  name?: string;
  teacher?: ITeacher | null;
  subject?: ISubject | null;
  students?: IStudent[] | null;
}

export class Course implements ICourse {
  constructor(
    public id?: number,
    public name?: string,
    public teacher?: ITeacher | null,
    public subject?: ISubject | null,
    public students?: IStudent[] | null
  ) {}
}

export function getCourseIdentifier(course: ICourse): number | undefined {
  return course.id;
}
