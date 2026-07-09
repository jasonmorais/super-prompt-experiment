import type { CoursePassport } from '../../contexts/course/course.passport.ts';
import type { Passport } from '../../contexts/passport.ts';
import { GuestCoursePassport } from './contexts/guest.course.passport.ts';
import { GuestPassportBase } from './guest.passport-base.ts';

export class GuestPassport extends GuestPassportBase implements Passport {
	private _coursePassport: CoursePassport | undefined;

	public get course(): CoursePassport {
		if (!this._coursePassport) {
			this._coursePassport = new GuestCoursePassport();
		}
		return this._coursePassport;
	}
}
