import type { ApiContextSpec } from '@learnsphere/context-spec';
import { Domain } from '@learnsphere/domain';
import type { DataSources } from '@learnsphere/persistence';

export interface VerifiedJwt {
	sub: string;
	email?: string;
	given_name?: string;
	family_name?: string;
	roles?: string[];
}

export interface VerifiedUser {
	verifiedJwt?: VerifiedJwt | undefined;
	openIdConfigKey?: string | undefined;
	hints?: PrincipalHints | undefined;
}

export type PrincipalHints = {
	organizationId?: string | undefined;
	learnerId?: string | undefined;
};

export interface CourseCreateCommand {
	organizationId: string;
	title: string;
	summary: string;
	description: string;
	level: Domain.Contexts.Learning.Course.CourseLevel;
	category: string;
	tags?: string[];
	skills?: string[];
}

export interface CourseModuleCommand {
	courseId: string;
	module: Omit<Domain.Contexts.Learning.Course.CourseModule, 'order'>;
}

export interface ApplicationServices {
	get verifiedUser(): VerifiedUser | null;
	Learning: {
		Course: {
			create(command: CourseCreateCommand): Promise<Domain.Contexts.Learning.Course.CourseEntityReference>;
			queryById(command: { id: string }): Promise<Domain.Contexts.Learning.Course.CourseEntityReference | null>;
			list(command: { organizationId: string; status?: Domain.Contexts.Learning.Course.CourseStatus; search?: string; limit?: number }): Promise<Domain.Contexts.Learning.Course.CourseEntityReference[]>;
			addModule(command: CourseModuleCommand): Promise<Domain.Contexts.Learning.Course.CourseEntityReference>;
			submitForReview(command: { id: string }): Promise<Domain.Contexts.Learning.Course.CourseEntityReference>;
			publish(command: { id: string }): Promise<Domain.Contexts.Learning.Course.CourseEntityReference>;
		};
	};
	Delivery: {
		LearningRecord: {
			myLearning(command: { organizationId: string }): Promise<Domain.Contexts.Delivery.LearningRecord.LearningRecordEntityReference[]>;
			selfEnroll(command: { organizationId: string; courseId: string }): Promise<Domain.Contexts.Delivery.LearningRecord.LearningRecordEntityReference>;
			assign(command: { organizationId: string; learnerId: string; courseId: string; dueAt?: Date; source: Exclude<Domain.Contexts.Delivery.LearningRecord.EnrollmentSource, 'SELF_ENROLLED'> }): Promise<Domain.Contexts.Delivery.LearningRecord.LearningRecordEntityReference>;
			recordActivity(command: { id: string; activityKey: string; timeSpentMinutes: number; assessmentScore?: number }): Promise<Domain.Contexts.Delivery.LearningRecord.LearningRecordEntityReference>;
			waive(command: { id: string; reason: string }): Promise<Domain.Contexts.Delivery.LearningRecord.LearningRecordEntityReference>;
		};
	};
}

export interface AppServicesHost<S> {
	forRequest(rawAuthHeader?: string, hints?: PrincipalHints): Promise<S>;
}
export type ApplicationServicesFactory = AppServicesHost<ApplicationServices>;

const courseServices = (dataSources: DataSources, subject: string, roles: string[]): ApplicationServices['Learning']['Course'] => {
	const mutate = async (id: string, action: (course: Domain.Contexts.Learning.Course.Course) => void) => {
		let result: Domain.Contexts.Learning.Course.CourseEntityReference | undefined;
		await dataSources.domainDataSource.Learning.Course.CourseUnitOfWork.withScopedTransaction(async (repo) => {
			const course = await repo.get(id);
			action(course);
			result = await repo.save(course);
		});
		if (!result) throw new Error(`Course ${id} was not saved`);
		return result;
	};

	return {
		async create(command) {
			if (!roles.some((role) => ['Instructor', 'LearningAdmin'].includes(role))) throw new Error('Instructor or learning administrator role required');
			let result: Domain.Contexts.Learning.Course.CourseEntityReference | undefined;
			await dataSources.domainDataSource.Learning.Course.CourseUnitOfWork.withScopedTransaction(async (repo) => {
				const course = await repo.getNewInstance({ ...command, createdBy: subject });
				course.setTaxonomy(command.tags ?? [], command.skills ?? []);
				result = await repo.save(course);
			});
			if (!result) throw new Error('Course was not created');
			return result;
		},
		queryById: ({ id }) => dataSources.readonlyDataSource.Learning.Course.CourseReadRepo.getById(id),
		list: (command) => dataSources.readonlyDataSource.Learning.Course.CourseReadRepo.list(command),
		addModule: ({ courseId, module }) => mutate(courseId, (course) => course.addModule(module)),
		submitForReview: ({ id }) => mutate(id, (course) => course.submitForReview()),
		publish: ({ id }) => mutate(id, (course) => course.publish()),
	};
};

const learningRecordServices = (dataSources: DataSources, subject: string, roles: string[]): ApplicationServices['Delivery']['LearningRecord'] => {
	const mutate = async (id: string, action: (record: Domain.Contexts.Delivery.LearningRecord.LearningRecord) => void) => {
		let result: Domain.Contexts.Delivery.LearningRecord.LearningRecordEntityReference | undefined;
		await dataSources.domainDataSource.Delivery.LearningRecord.LearningRecordUnitOfWork.withScopedTransaction(async (repo) => {
			const record = await repo.get(id);
			action(record);
			result = await repo.save(record);
		});
		if (!result) throw new Error(`Learning record ${id} was not saved`);
		return result;
	};

	const enroll = async (command: { organizationId: string; learnerId: string; courseId: string; source: Domain.Contexts.Delivery.LearningRecord.EnrollmentSource; assignedBy: string | null; dueAt: Date | null }) => {
		const course = await dataSources.readonlyDataSource.Learning.Course.CourseReadRepo.getById(command.courseId);
		if (!course) throw new Error(`Course ${command.courseId} was not found`);
		if (course.status !== 'PUBLISHED') throw new Error('Only published courses can be assigned or enrolled');
		const requiredActivityKeys = course.modules.flatMap((module) => module.lessons.filter((lesson) => lesson.required).map((lesson) => lesson.key));
		let result: Domain.Contexts.Delivery.LearningRecord.LearningRecordEntityReference | undefined;
		await dataSources.domainDataSource.Delivery.LearningRecord.LearningRecordUnitOfWork.withScopedTransaction(async (repo) => {
			const record = await repo.getNewInstance({
				organizationId: command.organizationId,
				learnerId: command.learnerId,
				courseId: course.id,
				courseTitle: course.title,
				courseCategory: course.category,
				requiredActivityKeys,
				source: command.source,
				assignedBy: command.assignedBy,
				dueAt: command.dueAt,
			});
			result = await repo.save(record);
		});
		if (!result) throw new Error('Learning record was not created');
		return result;
	};

	return {
		myLearning: ({ organizationId }) => dataSources.readonlyDataSource.Delivery.LearningRecord.LearningRecordReadRepo.getByLearner(organizationId, subject),
		selfEnroll: ({ organizationId, courseId }) => enroll({ organizationId, courseId, learnerId: subject, source: 'SELF_ENROLLED', assignedBy: null, dueAt: null }),
		assign: ({ organizationId, learnerId, courseId, dueAt, source }) => {
			if (!roles.some((role) => ['Manager', 'LearningAdmin'].includes(role))) throw new Error('Manager or learning administrator role required');
			return enroll({ organizationId, learnerId, courseId, source, assignedBy: subject, dueAt: dueAt ?? null });
		},
		recordActivity: ({ id, activityKey, timeSpentMinutes, assessmentScore }) => mutate(id, (record) => record.recordActivity(activityKey, timeSpentMinutes, assessmentScore)),
		waive: ({ id, reason }) => mutate(id, (record) => record.waive(reason)),
	};
};

export const buildApplicationServicesFactory = (context: ApiContextSpec): ApplicationServicesFactory => ({
	async forRequest(rawAuthHeader, hints) {
		const accessToken = rawAuthHeader?.replace(/^Bearer\s+/i, '').trim();
		const tokenValidationResult = accessToken ? await context.tokenValidationService.verifyJwt<VerifiedJwt>(accessToken) : null;
		const roles = tokenValidationResult?.verifiedJwt?.roles ?? [];
		const subject = tokenValidationResult?.verifiedJwt?.sub ?? 'anonymous';
		const passport = roles.includes('LearningAdmin') ? Domain.PassportFactory.forSystem() : roles.includes('Instructor') ? Domain.PassportFactory.forInstructor() : tokenValidationResult ? Domain.PassportFactory.forLearner(subject) : Domain.PassportFactory.forGuest();
		const dataSources = context.dataSourcesFactory.withPassport(passport);
		return {
			get verifiedUser() { return tokenValidationResult ? { ...tokenValidationResult, hints } : null; },
			Learning: { Course: courseServices(dataSources, subject, roles) },
			Delivery: { LearningRecord: learningRecordServices(dataSources, subject, roles) },
		};
	},
});
