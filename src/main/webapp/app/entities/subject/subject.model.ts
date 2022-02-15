import { ICourse } from 'app/entities/course/course.model';

export interface ISubject {
  id?: number;
  name?: string;
  courses?: ICourse[] | null;
}

export class Subject implements ISubject {
  constructor(public id?: number, public name?: string, public courses?: ICourse[] | null) {}
}

export function getSubjectIdentifier(subject: ISubject): number | undefined {
  return subject.id;
}
