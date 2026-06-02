/**
 * Get the difference between two arrays
 * @param previous Old array
 * @param current New array
 * @returns [additions, removals]
 */
export function arrayDiff<T>(previous: T[], current: T[]): [additions: T[], removals: T[]] {
	return [
		current.filter((item) => !previous.includes(item)),
		previous.filter((item) => !current.includes(item)),
	];
}
