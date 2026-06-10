// Import types
import {
	ButtonInteraction,
	ModalSubmitInteraction,
	StringSelectMenuInteraction,
} from 'discord.js';
import { Bot } from '../app.class';

export abstract class BotComponent {
	constructor(public bot: Bot) {}

	public name: string;

	abstract handle(interaction: TInteraction): Promise<any> | any;
}

export type TInteraction<S = ''> = S extends 'button'
	? ButtonInteraction
	: S extends 'modal'
		? ModalSubmitInteraction
		: S extends 'select'
			? StringSelectMenuInteraction
			: unknown;

export type BotComponentConstructor = new (bot: Bot) => BotComponent;
