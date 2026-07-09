import type { CoursePassport } from '../../contexts/course/course.passport.ts';
import type { Passport } from '../../contexts/passport.ts';
import { SystemCoursePassport } from './contexts/system.course.passport.ts';
import { SystemPassportBase } from './system.passport-base.ts';

export class SystemPassport extends SystemPassportBase implements Passport {
	private _coursePassport: CoursePassport | undefined;

	public get course(): CoursePassport {
		if (!this._coursePassport) {
			this._coursePassport = new SystemCoursePassport(this.permissions);
		}
		return this._coursePassport;
	}
}
