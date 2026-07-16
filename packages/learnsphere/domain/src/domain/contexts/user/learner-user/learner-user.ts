import { AggregateRoot } from '@cellix/domain-seedwork/aggregate-root';
import type { DomainEntityProps } from '@cellix/domain-seedwork/domain-entity';
import { PermissionError } from '@cellix/domain-seedwork/domain-entity';
import type { Passport } from '../../passport.ts';
import type { UserVisa } from '../user.visa.ts';

export interface LearnerUserPersonalInformationProps {
	identityDetails: { lastName: string; legalNameConsistsOfOneName: boolean; restOfName: string | undefined };
	contactInformation: { email: string };
}

export interface LearnerUserProps extends DomainEntityProps {
	personalInformation: LearnerUserPersonalInformationProps;
	email: string;
	displayName: string;
	externalId: string;
	accessBlocked: boolean;
	tags: string[];
	readonly userType: string;
	readonly schemaVersion: string;
	readonly createdAt: Date;
	readonly updatedAt: Date;
}

export type LearnerUserEntityReference = Readonly<LearnerUserProps>;

const normalizedText = (value: string, field: string): string => {
	const normalized = value.trim();
	if (!normalized) throw new Error(`${field} is required`);
	return normalized;
};

export class LearnerUser<props extends LearnerUserProps = LearnerUserProps> extends AggregateRoot<props, Passport> implements LearnerUserEntityReference {
	private isNew = false;
	private readonly visa: UserVisa;

	constructor(props: props, passport: Passport) {
		super(props, passport);
		this.visa = passport.user.forLearnerUser(this);
	}

	static getNewInstance<props extends LearnerUserProps>(newProps: props, passport: Passport, externalId: string, lastName: string, restOfName: string | undefined, email: string): LearnerUser<props> {
		const user = new LearnerUser(newProps, passport);
		user.isNew = true;
		user.externalId = externalId;
		user.personalInformation.identityDetails.lastName = normalizedText(lastName, 'Last name');
		user.personalInformation.contactInformation.email = email;
		if (restOfName?.trim()) {
			user.personalInformation.identityDetails.legalNameConsistsOfOneName = false;
			user.personalInformation.identityDetails.restOfName = restOfName.trim();
			user.displayName = `${restOfName.trim()} ${lastName.trim()}`;
		} else {
			user.personalInformation.identityDetails.legalNameConsistsOfOneName = true;
			user.displayName = lastName.trim();
		}
		user.isNew = false;
		return user;
	}

	private validateOwnAccount(): void {
		if (!this.isNew && !this.visa.determineIf((permissions) => permissions.isEditingOwnAccount || permissions.canManageLearnerUsers)) {
			throw new PermissionError('You do not have permission to update this learner');
		}
	}

	override get id() { return this.props.id; }
	get personalInformation() { return this.props.personalInformation; }
	get email() { return this.props.email; }
	set email(value: string) { this.validateOwnAccount(); this.props.email = value.trim(); this.props.personalInformation.contactInformation.email = this.props.email; }
	get displayName() { return this.props.displayName; }
	set displayName(value: string) { this.validateOwnAccount(); this.props.displayName = normalizedText(value, 'Display name'); }
	get externalId() { return this.props.externalId; }
	private set externalId(value: string) { if (!this.isNew) throw new Error('External ID cannot be changed'); this.props.externalId = normalizedText(value, 'External ID'); }
	get accessBlocked() { return this.props.accessBlocked; }
	set accessBlocked(value: boolean) { if (!this.visa.determineIf((permissions) => permissions.canManageLearnerUsers || permissions.isSystemAccount)) throw new PermissionError('You do not have permission to block this learner'); this.props.accessBlocked = value; }
	get tags() { return [...this.props.tags]; }
	set tags(value: string[]) { if (!this.visa.determineIf((permissions) => permissions.canManageLearnerUsers || permissions.isSystemAccount)) throw new PermissionError('You do not have permission to update learner tags'); this.props.tags = [...value]; }
	get userType() { return this.props.userType; }
	get schemaVersion() { return this.props.schemaVersion; }
	get createdAt() { return this.props.createdAt; }
	get updatedAt() { return this.props.updatedAt; }
}
