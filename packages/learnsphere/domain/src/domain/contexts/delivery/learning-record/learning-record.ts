import { AggregateRoot } from '@cellix/domain-seedwork/aggregate-root';
import type { DomainEntityProps } from '@cellix/domain-seedwork/domain-entity';
import { PermissionError } from '@cellix/domain-seedwork/domain-entity';
import type { Passport } from '../../../passport-factory.ts';

export type EnrollmentSource = 'SELF_ENROLLED' | 'MANAGER_ASSIGNED' | 'PROGRAM_ASSIGNED' | 'COMPLIANCE_ASSIGNED';
export type LearningRecordStatus = 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED' | 'OVERDUE' | 'WAIVED';

export interface ActivityProgress {
	activityKey: string;
	completedAt: Date;
	timeSpentMinutes: number;
	assessmentScore: number | null;
	attempts: number;
}

export interface LearningRecordProps extends DomainEntityProps {
	organizationId: string;
	learnerId: string;
	courseId: string;
	courseTitle: string;
	courseCategory: string;
	requiredActivityKeys: string[];
	source: EnrollmentSource;
	status: LearningRecordStatus;
	assignedBy: string | null;
	assignedAt: Date;
	dueAt: Date | null;
	startedAt: Date | null;
	completedAt: Date | null;
	waivedAt: Date | null;
	waiverReason: string | null;
	activityProgress: ActivityProgress[];
	createdAt: Date;
	updatedAt: Date;
	schemaVersion: string;
}

export interface LearningRecordEntityReference extends Readonly<LearningRecordProps> {
	progressPercent: number;
	completedActivityCount: number;
	isOverdue: boolean;
}

export class LearningRecord<Props extends LearningRecordProps = LearningRecordProps> extends AggregateRoot<Props, Passport> implements LearningRecordEntityReference {
	static getNewInstance<Props extends LearningRecordProps>(props: Props, input: Omit<LearningRecordProps, keyof DomainEntityProps | 'status' | 'assignedAt' | 'startedAt' | 'completedAt' | 'waivedAt' | 'waiverReason' | 'activityProgress' | 'createdAt' | 'updatedAt' | 'schemaVersion'>, passport: Passport) {
		const record = new LearningRecord(props, passport);
		if (!input.organizationId.trim() || !input.learnerId.trim() || !input.courseId.trim()) throw new Error('Organization, learner, and course are required');
		if (input.requiredActivityKeys.length === 0) throw new Error('Published learning must contain required activities');
		props.organizationId = input.organizationId;
		props.learnerId = input.learnerId;
		props.courseId = input.courseId;
		props.courseTitle = input.courseTitle.trim();
		props.courseCategory = input.courseCategory.trim();
		props.requiredActivityKeys = [...new Set(input.requiredActivityKeys)];
		props.source = input.source;
		props.assignedBy = input.assignedBy;
		props.dueAt = input.dueAt;
		props.status = 'NOT_STARTED';
		props.assignedAt = new Date();
		props.startedAt = null;
		props.completedAt = null;
		props.waivedAt = null;
		props.waiverReason = null;
		props.activityProgress = [];
		return record;
	}

	private get visa() { return this.passport.delivery.forLearningRecord(this); }
	get organizationId() { return this.props.organizationId; }
	get learnerId() { return this.props.learnerId; }
	get courseId() { return this.props.courseId; }
	get courseTitle() { return this.props.courseTitle; }
	get courseCategory() { return this.props.courseCategory; }
	get requiredActivityKeys() { return [...this.props.requiredActivityKeys]; }
	get source() { return this.props.source; }
	get status(): LearningRecordStatus { return this.isOverdue && this.props.status !== 'COMPLETED' && this.props.status !== 'WAIVED' ? 'OVERDUE' : this.props.status; }
	get assignedBy() { return this.props.assignedBy; }
	get assignedAt() { return this.props.assignedAt; }
	get dueAt() { return this.props.dueAt; }
	get startedAt() { return this.props.startedAt; }
	get completedAt() { return this.props.completedAt; }
	get waivedAt() { return this.props.waivedAt; }
	get waiverReason() { return this.props.waiverReason; }
	get activityProgress() { return this.props.activityProgress.map((progress) => ({ ...progress })); }
	get createdAt() { return this.props.createdAt; }
	get updatedAt() { return this.props.updatedAt; }
	get schemaVersion() { return this.props.schemaVersion; }
	get completedActivityCount() { return this.props.requiredActivityKeys.filter((key) => this.props.activityProgress.some((progress) => progress.activityKey === key)).length; }
	get progressPercent() { return Math.round((this.completedActivityCount / this.props.requiredActivityKeys.length) * 100); }
	get isOverdue() { return Boolean(this.props.dueAt && this.props.dueAt.getTime() < Date.now() && !['COMPLETED', 'WAIVED'].includes(this.props.status)); }

	recordActivity(activityKey: string, timeSpentMinutes: number, assessmentScore?: number): void {
		if (!this.visa.determineIf((permissions) => permissions.canRecordProgress)) throw new PermissionError('You may only record progress for your own learning');
		if (this.props.status === 'COMPLETED' || this.props.status === 'WAIVED') throw new Error('Completed or waived learning cannot be changed');
		if (!this.props.requiredActivityKeys.includes(activityKey)) throw new Error(`Activity ${activityKey} is not part of this enrollment`);
		if (timeSpentMinutes < 0 || timeSpentMinutes > 1440) throw new Error('Time spent must be between 0 and 1440 minutes');
		if (assessmentScore !== undefined && (assessmentScore < 0 || assessmentScore > 100)) throw new Error('Assessment score must be between 0 and 100');
		const existing = this.props.activityProgress.find((progress) => progress.activityKey === activityKey);
		if (existing) {
			existing.completedAt = new Date();
			existing.timeSpentMinutes += timeSpentMinutes;
			existing.assessmentScore = assessmentScore ?? existing.assessmentScore;
			existing.attempts += 1;
		} else {
			this.props.activityProgress.push({ activityKey, completedAt: new Date(), timeSpentMinutes, assessmentScore: assessmentScore ?? null, attempts: 1 });
		}
		this.props.startedAt ??= new Date();
		if (this.completedActivityCount === this.props.requiredActivityKeys.length) {
			this.props.status = 'COMPLETED';
			this.props.completedAt = new Date();
		} else {
			this.props.status = 'IN_PROGRESS';
		}
	}

	waive(reason: string): void {
		if (!this.visa.determineIf((permissions) => permissions.canWaiveAssignments)) throw new PermissionError('You do not have permission to waive learning');
		if (this.props.status === 'COMPLETED') throw new Error('Completed learning cannot be waived');
		if (reason.trim().length < 10) throw new Error('A meaningful waiver reason is required');
		this.props.status = 'WAIVED';
		this.props.waivedAt = new Date();
		this.props.waiverReason = reason.trim();
	}
}
