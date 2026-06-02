import { Snowflake, userMention } from "discord.js";

export function listFormat(iterable: Iterable<string>, locale = "en-nz") {
	return new Intl.ListFormat(locale).format(iterable);
}

export function map<T, V>(array: T[], fn: (item: T) => V) {
	return array.map(fn);
}

export function formatUserMentionsFromIds(ids: Snowflake[]) {
	return listFormat(map(ids, userMention));
}

export function hexToInt(hex: string): number {
	return Number(`0x${hex.replace("#", "")}`);
}

export function isStringValidNumber(value: string) {
	return !Number.isNaN(+value) && value.trim() !== "";
}
