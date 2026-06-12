// Import types
import { Bot } from '../app.class';

// Import requirements
import {
	CacheType,
	ChatInputCommandInteraction,
	SlashCommandBuilder,
} from 'discord.js';

export abstract class BotCommand {
	constructor(public bot: Bot) {}

	public cooldown: number;
	public meta: SlashCommandBuilder;

	abstract handle(
		interaction: ChatInputCommandInteraction<CacheType>,
	): Promise<void> | void;
}

export type BotCommandConstructor = new (bot: Bot) => BotCommand;
