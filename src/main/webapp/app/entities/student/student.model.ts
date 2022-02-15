import { ICourse } from 'app/entities/course/course.model';

export interface IStudent {
  id?: number;
  firstName?: string | null;
  lastName?: string | null;
  email?: string | null;
  courses?: ICourse[] | null;
}

export class Student implements IStudent {
  constructor(
    public id?: number,
    public firstName?: string | null,
    public lastName?: string | null,
    public email?: string | null,
    public courses?: ICourse[] | null
  ) {}
}

export function getStudentIdentifier(student: IStudent): number | undefined {
  return student.id;
}
