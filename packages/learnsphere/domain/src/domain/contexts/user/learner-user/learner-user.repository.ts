import type { Repository } from '@cellix/domain-seedwork/repository';
import type { LearnerUser, LearnerUserProps } from './learner-user.ts';

export interface LearnerUserRepository<props extends LearnerUserProps = LearnerUserProps> extends Repository<LearnerUser<props>> {
	getByExternalId(externalId: string): Promise<LearnerUser<props>>;
	getNewInstance(externalId: string, lastName: string, restOfName: string | undefined, email: string): Promise<LearnerUser<props>>;
}
