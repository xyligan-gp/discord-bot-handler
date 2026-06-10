// Import class
import { Bot } from '../../app.class';
import { BotEvent } from '../event.class';

// Import requirements
import { Events } from 'discord.js';

export default class ErrorEvent extends BotEvent {
	constructor(bot: Bot) {
		super(bot);

		this.name = Events.Error;
	}

	async handle(e: Error): Promise<void> {
		this.bot.logger.error(e);
	}
}
