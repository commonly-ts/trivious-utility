export function generateRandomHex(length: number) {
	const characters = "0123456789abcdef";
	let hex = "";
	for (let i = 0; i < length; i++) {
		const randomIndex = Math.round(Math.random() * characters.length);
		hex += characters.charAt(randomIndex);
	}
	return hex;
}

export function getTimestampSeconds(date?: Date) {
	return Math.ceil((date || new Date()).getTime() / 1000);
}

export function buildStringFromParts<F extends string[][number][]>(
	format: F,
	parts: Record<string, string>,
	separator = "-"
) {
	return format.map((key) => String(parts[key as F[number]])).join(separator);
}
