/**
 * A passport authorizes what a caller may do within the domain.
 *
 * The blank scaffold provides only a guest passport. Add member, staff, and
 * system passports — together with the visa logic that enforces permissions —
 * as your authorization model takes shape.
 */
export interface Passport {
	readonly isGuest: boolean;
}

export const PassportFactory = {
	forGuest(): Passport {
		return { isGuest: true };
	},
} as const;
