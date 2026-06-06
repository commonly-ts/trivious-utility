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

export function getRandomInt(max: number) {
	if (max <= 0) throw new Error("getRandomInt max must be greater than zero");
	const limit = 2 ** 32 - (2 ** 32 % max);
	const buffer = new Uint32Array(1);

	while (true) {
		crypto.getRandomValues(buffer);
		const value = buffer[0];
		if (value < limit) {
			return value % max;
		}
	}
}
