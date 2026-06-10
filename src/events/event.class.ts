// Import types
import { Bot } from '../app.class';

// Import requirements
import { ClientEvents, Events } from 'discord.js';

export abstract class BotEvent {
	constructor(public bot: Bot) {}

	public name: keyof ClientEvents;
	abstract handle(...args: any[]): Promise<void> | void;
}

export type BotEventConstructor = new (bot: Bot) => BotEvent;
