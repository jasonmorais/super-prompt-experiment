import type { Team as TeamDocument, TeamMember } from '@learnsphere/data-sources-mongoose-models';
import type { ModelsContext } from '../index.ts';

export interface TeamRecord { id: string; schemaVersion: string; organizationId: string; name: string; members: TeamMember[]; teamLeadIds: string[]; createdBy: string; createdAt: Date; updatedAt: Date; }
export interface TeamDataSource {
	getById(id: string): Promise<TeamRecord | null>;
	list(organizationId: string): Promise<TeamRecord[]>;
	create(input: { organizationId: string; name: string; createdBy: string }): Promise<TeamRecord>;
	rename(id: string, name: string): Promise<TeamRecord>;
	remove(id: string): Promise<void>;
	setMembers(id: string, members: readonly TeamMember[]): Promise<TeamRecord>;
	setTeamLeads(id: string, teamLeadIds: readonly string[]): Promise<TeamRecord>;
}

const toRecord = (document: TeamDocument): TeamRecord => ({ id: String(document._id), schemaVersion: document.schemaVersion, organizationId: document.organizationId, name: document.name, members: document.members.map((member) => ({ ...member })), teamLeadIds: [...document.teamLeadIds], createdBy: document.createdBy, createdAt: document.createdAt, updatedAt: document.updatedAt });

export class TeamDataSourceImpl implements TeamDataSource {
	private readonly models: ModelsContext;
	constructor(models: ModelsContext) { this.models = models; }
	async getById(id: string) { const document = await this.models.Team.findById(id).exec(); return document ? toRecord(document) : null; }
	async list(organizationId: string) { const documents = await this.models.Team.find({ organizationId }).sort({ name: 1 }).exec(); return documents.map(toRecord); }
	async create(input: { organizationId: string; name: string; createdBy: string }) { const document = await this.models.Team.create({ ...input, members: [], teamLeadIds: [] }); return toRecord(document); }
	async rename(id: string, name: string) {
		const current = await this.models.Team.findById(id).exec();
		if (!current) throw new Error('Team was not found');
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
		await this.models.LearningRecord.updateMany({ organizationId: current.organizationId, teamName: current.name }, { $set: { teamName: 'Unassigned' } }).exec();
		await this.models.TeamOperation.updateMany({ organizationId: current.organizationId, teamName: current.name }, { $set: { teamName: 'Unassigned' } }).exec();
		await this.models.Team.deleteOne({ _id: id }).exec();
	}
	async setMembers(id: string, members: readonly TeamMember[]) { const document = await this.models.Team.findByIdAndUpdate(id, { $set: { members } }, { new: true }).exec(); if (!document) throw new Error('Team was not found'); return toRecord(document); }
	async setTeamLeads(id: string, teamLeadIds: readonly string[]) { const document = await this.models.Team.findByIdAndUpdate(id, { $set: { teamLeadIds } }, { new: true }).exec(); if (!document) throw new Error('Team was not found'); return toRecord(document); }
}

export const getTeamDataSource = (models: ModelsContext): TeamDataSource => new TeamDataSourceImpl(models);
