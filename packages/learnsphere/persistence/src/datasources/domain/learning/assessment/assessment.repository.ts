import { MongooseSeedwork } from '@cellix/mongoose-seedwork';
import type { Assessment as AssessmentDocument } from '@learnsphere/data-sources-mongoose-models';
import { Domain } from '@learnsphere/domain';
import type { AssessmentDomainAdapter } from './assessment.domain-adapter.ts';
export class AssessmentRepository
	extends MongooseSeedwork.MongoRepositoryBase<AssessmentDocument, AssessmentDomainAdapter, Domain.Passport, Domain.Contexts.Learning.Assessment.Assessment<AssessmentDomainAdapter>>
	implements Domain.Contexts.Learning.Assessment.AssessmentRepository<AssessmentDomainAdapter>
{
	async getById(id: string) {
		const document = await this.model.findById(id).exec();
		if (!document) throw new Error(`Assessment with id ${id} not found`);
		return this.typeConverter.toDomain(document, this.passport);
	}
	getNewInstance(input: { organizationId: string; title: string; description: string; passingScore: number; maxAttempts: number; createdBy: string }) {
		const adapter = this.typeConverter.toAdapter(new this.model());
		return Promise.resolve(Domain.Contexts.Learning.Assessment.Assessment.getNewInstance(adapter, input, this.passport));
	}
}
