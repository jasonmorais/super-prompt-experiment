import type { Resolvers } from '../builder/generated.ts';
import type { GraphContext } from '../context.ts';

const learnerUser: Resolvers = {
	Query: {
		currentLearnerUserAndCreateIfNotExists: (_parent, _args, context: GraphContext) => {
			const jwt = context.applicationServices.verifiedUser?.verifiedJwt;
			if (!jwt || context.applicationServices.verifiedUser?.openIdConfigKey === 'StaffPortal') throw new Error('Unauthorized');
			const firstName = jwt.given_name ?? '';
			const lastName = jwt.family_name ?? (firstName || 'Learner');
			return context.applicationServices.User.LearnerUser.createIfNotExists({ externalId: jwt.sub, lastName, ...(firstName && jwt.family_name ? { restOfName: firstName } : {}), email: jwt.email ?? '' });
		},
	},
};

export default learnerUser;
