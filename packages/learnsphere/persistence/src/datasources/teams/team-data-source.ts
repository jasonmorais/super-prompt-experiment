import type { Team as TeamDocument, TeamMember } from '@learnsphere/data-sources-mongoose-models';
import type { Domain } from '@learnsphere/domain';
import type { ModelsContext } from '../../index.ts';

export interface TeamRecord {
	id: string;
	schemaVersion: string;
	organizationId: string;
	name: string;
	members: TeamMember[];
	teamLeadIds: string[];
	createdBy: string;
	createdAt: Date;
	updatedAt: Date;
}
export interface TeamDataSource {
	getById(id: string): Promise<TeamRecord | null>;
	list(organizationId: string): Promise<TeamRecord[]>;
	create(input: { organizationId: string; name: string; createdBy: string }): Promise<TeamRecord>;
	rename(id: string, name: string): Promise<TeamRecord>;
	remove(id: string): Promise<void>;
	setMembers(id: string, members: readonly TeamMember[]): Promise<TeamRecord>;
	setTeamLeads(id: string, teamLeadIds: readonly string[]): Promise<TeamRecord>;
}

const isUsableMember = (member: Partial<TeamMember> | null | undefined): member is TeamMember => Boolean(member?.learnerId?.trim() && member.displayName?.trim() && member.email?.trim());

// Teams created before member validation was introduced can contain null or
// incomplete subdocuments. Keep those records manageable while the data is
// repaired instead of allowing one bad member to null the whole GraphQL query.
const toRecord = (document: TeamDocument): TeamRecord => {
	const members = document.members.filter(isUsableMember).map((member) => ({ learnerId: member.learnerId, displayName: member.displayName, email: member.email }));
	const memberIds = new Set(members.map((member) => member.learnerId));
	return {
		id: String(document._id),
		schemaVersion: document.schemaVersion,
		organizationId: document.organizationId,
		name: document.name,
		members,
		teamLeadIds: document.teamLeadIds.filter((id) => memberIds.has(id)),
		createdBy: document.createdBy,
		createdAt: document.createdAt,
		updatedAt: document.updatedAt,
	};
};

export class TeamDataSourceImpl implements TeamDataSource {
	private readonly models: ModelsContext;
	private readonly passport: Domain.Passport;
	constructor(models: ModelsContext, passport: Domain.Passport) {
		this.models = models;
		this.passport = passport;
	}
	private requireView(organizationId: string): void {
		if (!this.passport.canAccessOrganization(organizationId) || !this.passport.canViewTeamLearning) throw new Error('You do not have access to team learning in this organization');
	}
	private requireManage(organizationId: string): void {
		this.requireView(organizationId);
		if (!this.passport.canManageTeams) throw new Error('Manager role required');
	}
	async getById(id: string) {
		const document = await this.models.Team.findById(id).exec();
		if (document) this.requireView(document.organizationId);
		return document ? toRecord(document) : null;
	}
	async list(organizationId: string) {
		this.requireView(organizationId);
		const documents = await this.models.Team.find({ organizationId }).sort({ name: 1 }).exec();
		return documents.map(toRecord);
	}
	async create(input: { organizationId: string; name: string; createdBy: string }) {
		this.requireManage(input.organizationId);
		const document = await this.models.Team.create({ ...input, members: [], teamLeadIds: [] });
		return toRecord(document);
	}
	async rename(id: string, name: string) {
		const current = await this.models.Team.findById(id).exec();
		if (!current) throw new Error('Team was not found');
		this.requireManage(current.organizationId);
		const oldName = current.name;
		current.name = name.trim();
		await current.save();
		await this.models.LearningRecord.updateMany({ organizationId: current.organizationId, teamName: oldName }, { $set: { teamName: current.name } }).exec();
		await this.models.TeamOperation.updateMany({ organizationId: current.organizationId, teamName: oldName }, { $set: { teamName: current.name } }).exec();
		return toRecord(current);
	}
	async remove(id: string) {
		const current = await this.models.Team.findById(id).exec();
		if (!current) return;
		this.requireManage(current.organizationId);
		await this.models.LearningRecord.updateMany({ organizationId: current.organizationId, teamName: current.name }, { $set: { teamName: 'Unassigned' } }).exec();
		await this.models.TeamOperation.updateMany({ organizationId: current.organizationId, teamName: current.name }, { $set: { teamName: 'Unassigned' } }).exec();
		await this.models.Team.deleteOne({ _id: id }).exec();
	}
	async setMembers(id: string, members: readonly TeamMember[]) {
		const current = await this.models.Team.findById(id).exec();
		if (!current) throw new Error('Team was not found');
		this.requireManage(current.organizationId);
		const validMembers = members.filter(isUsableMember).map((member) => ({ learnerId: member.learnerId.trim(), displayName: member.displayName.trim(), email: member.email.trim() }));
		const document = await this.models.Team.findByIdAndUpdate(id, { $set: { members: validMembers }, $pull: { teamLeadIds: { $nin: validMembers.map((member) => member.learnerId) } } }, { new: true }).exec();
		if (!document) throw new Error('Team was not found');
		return toRecord(document);
	}
	async setTeamLeads(id: string, teamLeadIds: readonly string[]) {
		const current = await this.models.Team.findById(id).exec();
		if (!current) throw new Error('Team was not found');
		this.requireManage(current.organizationId);
		const validMemberIds = new Set(current.members.filter(isUsableMember).map((member) => member.learnerId));
		const document = await this.models.Team.findByIdAndUpdate(id, { $set: { teamLeadIds: [...new Set(teamLeadIds.filter((teamLeadId) => validMemberIds.has(teamLeadId)))] } }, { new: true }).exec();
		if (!document) throw new Error('Team was not found');
		return toRecord(document);
	}
}

export const getTeamDataSource = (models: ModelsContext, passport: Domain.Passport): TeamDataSource => new TeamDataSourceImpl(models, passport);
