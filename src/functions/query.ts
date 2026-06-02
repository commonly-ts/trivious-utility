import {
	AwaitMessageCollectorOptionsParams,
	CacheType,
	GuildTextBasedChannel,
	Interaction,
	MappedInteractionTypes,
	MessageComponentType,
	TextChannel,
} from "discord.js";
import { interactionReply, SlashSubcommandData } from "trivious";

export type QueryPoolOption = string | { matchBy: string };
/**
 * Filters a pool of options based on a string query
 * @param input.query Text used to filter the pool
 * @param input.pool Array of options to search
 * @returns Filtered array of matching options
 */
export function queryFromPool<T extends QueryPoolOption>(input: {
	query: string;
	pool: T[];
	sliceEnd?: number;
}) {
	const { pool, query, sliceEnd } = input;
	const normalisedQuery = query.toLowerCase().replaceAll(" ", "");
	let results: T[] = [];
	if (query.length > 0) {
		results = pool.filter((option) => {
			const normalisedName =
				typeof option === "string" ? option.toLowerCase() : option.matchBy.toLowerCase();
			return normalisedName.startsWith(normalisedQuery) || normalisedName.includes(normalisedQuery);
		});
	} else {
		results = pool.slice(0, sliceEnd ?? 25);
	}
	return results;
}

type CollectedResult<T extends MessageComponentType> =
	| { ok: true; interaction: MappedInteractionTypes<boolean>[T] }
	| { ok: false; reason: "timeout" | "error" | "invalid" };
type CollectComponentOptions<T extends MessageComponentType> =
	AwaitMessageCollectorOptionsParams<T> & { replyOnError?: boolean; clearComponents?: boolean };
/**
 * Collect a component from an interaction reply
 * @param args.interaction The interaction
 * @param args.channel The target channel, othewise interaction.channel is used
 * @param args.options.replyOnError Whether to reply to the interaction if an error occurs
 * @param args.options.clearComponents Whether to remove components from the interaction reply after collecting
 * @returns An object with whether the component was collected, if so, returns the interaction, if not, returns the reason
 */
export async function collectComponent<T extends MessageComponentType>(args: {
	interaction: Interaction<CacheType>;
	channel?: TextChannel | GuildTextBasedChannel;
	options: CollectComponentOptions<T>;
}): Promise<CollectedResult<T>> {
	const { interaction, options, channel } = args;
	const targetChannel = channel || interaction.channel;
	const resolvedOptions: CollectComponentOptions<T> = { ...options };
	if (!targetChannel || !targetChannel.isTextBased() || !interaction.isRepliable())
		return { ok: false, reason: "invalid" };

	try {
		const collected = await targetChannel.awaitMessageComponent(resolvedOptions);
		if (options.clearComponents) await interaction.editReply({ components: [] });
		return { ok: true, interaction: collected };
	} catch (err: unknown) {
		const error = err as Error;
		const isTimeout = error.message.endsWith("with reason: time");
		if (!isTimeout) {
			console.error(error);
			if (options.replyOnError)
				await interactionReply({
					interaction,
					flags: ["EphemeralReply", "FollowUp"],
					replyPayload: {
						content: `Something went wrong! Failed to collect awaited message component: ${error.name}`,
					},
				});
		}
		return { ok: false, reason: isTimeout ? "timeout" : "error" };
	}
}

export function getOptionName(
	command: SlashSubcommandData,
	partial: string,
	searchBy: "startsWith" | "includes" | "endsWith"
) {
	const options = command.data.options;
	return options.find((o) => o.name[searchBy](partial))?.name;
}
