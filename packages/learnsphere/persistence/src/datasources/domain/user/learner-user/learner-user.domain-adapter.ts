import { MongooseSeedwork } from '@cellix/mongoose-seedwork';
import type { LearnerUser as LearnerUserDocument, LearnerUserContactInformation, LearnerUserIdentityDetails, LearnerUserPersonalInformation } from '@learnsphere/data-sources-mongoose-models';
import { Domain } from '@learnsphere/domain';

export class LearnerUserConverter extends MongooseSeedwork.MongoTypeConverter<LearnerUserDocument, LearnerUserDomainAdapter, Domain.Passport, Domain.Contexts.User.LearnerUser.LearnerUser<LearnerUserDomainAdapter>> {
	constructor() {
		super(LearnerUserDomainAdapter, Domain.Contexts.User.LearnerUser.LearnerUser);
	}
}

export class LearnerUserDomainAdapter extends MongooseSeedwork.MongooseDomainAdapter<LearnerUserDocument> implements Domain.Contexts.User.LearnerUser.LearnerUserProps {
	get personalInformation() {
		if (!this.doc.personalInformation) this.doc.set('personalInformation', {});
		return new LearnerUserPersonalInformationAdapter(this.doc.personalInformation);
	}
	get email() {
		return this.doc.email ?? '';
	}
	set email(value: string) {
		this.doc.email = value;
	}
	get displayName() {
		return this.doc.displayName ?? '';
	}
	set displayName(value: string) {
		this.doc.displayName = value;
	}
	get externalId() {
		return this.doc.externalId;
	}
	set externalId(value: string) {
		this.doc.externalId = value;
	}
	get accessBlocked() {
		return this.doc.accessBlocked ?? false;
	}
	set accessBlocked(value: boolean) {
		this.doc.accessBlocked = value;
	}
	get tags() {
		return this.doc.tags ?? [];
	}
	set tags(value: string[]) {
		this.doc.tags = value;
	}
	get userType() {
		return this.doc.userType ?? 'learner-user';
	}
	override get schemaVersion() {
		return this.doc.schemaVersion ?? '1.0.0';
	}
	override get createdAt() {
		return this.doc.createdAt as Date;
	}
	override get updatedAt() {
		return this.doc.updatedAt as Date;
	}
}

class LearnerUserPersonalInformationAdapter implements Domain.Contexts.User.LearnerUser.LearnerUserPersonalInformationProps {
	private readonly props: LearnerUserPersonalInformation;
	constructor(props: LearnerUserPersonalInformation) {
		this.props = props;
	}
	get identityDetails() {
		if (!this.props.identityDetails) this.props.set('identityDetails', {});
		return new LearnerUserIdentityDetailsAdapter(this.props.identityDetails);
	}
	get contactInformation() {
		if (!this.props.contactInformation) this.props.set('contactInformation', {});
		return new LearnerUserContactInformationAdapter(this.props.contactInformation);
	}
}
class LearnerUserIdentityDetailsAdapter {
	private readonly props: LearnerUserIdentityDetails;
	constructor(props: LearnerUserIdentityDetails) {
		this.props = props;
	}
	get lastName() {
		return this.props.lastName;
	}
	set lastName(value: string) {
		this.props.lastName = value;
	}
	get legalNameConsistsOfOneName() {
		return this.props.legalNameConsistsOfOneName;
	}
	set legalNameConsistsOfOneName(value: boolean) {
		this.props.legalNameConsistsOfOneName = value;
	}
	get restOfName() {
		return this.props.restOfName ?? '';
	}
	set restOfName(value: string | undefined) {
		this.props.restOfName = value ?? '';
	}
}
class LearnerUserContactInformationAdapter {
	private readonly props: LearnerUserContactInformation;
	constructor(props: LearnerUserContactInformation) {
		this.props = props;
	}
	get email() {
		return this.props.email ?? '';
	}
	set email(value: string) {
		this.props.email = value;
	}
}
