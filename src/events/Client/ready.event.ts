// Import class
import { Bot } from '../../app.class';
import { BotEvent } from '../event.class';

// Import requirements
import { Events } from 'discord.js';

export default class ReadyEvent extends BotEvent {
	constructor(bot: Bot) {
		super(bot);

		this.name = Events.ClientReady;
	}

	async handle(): Promise<void> {
		try {
			await this.bot.application.commands.set([]);

			for (const cmd of this.bot.commands.values()) {
				await this.bot.application.commands.create(cmd.meta.toJSON());

				this.bot.logger.info(
					`✅ Command '${cmd.meta.name}' successfully registered!`,
				);
			}

			this.bot.i18n.loadTranslations();
			this.bot.i18n.registerPartials(
				{ id: '{E}', value: '❌' },
				{ id: '{S}', value: '✅' },
				{ id: '{I}', value: '📌' },
				{ id: '{W}', value: '⏰' },
			);

			this.bot.logger.info(`🟢 Client '${this.bot.user.username}' is ready!`);
		} catch (e) {
			this.bot.logger.error(e);
			return;
		}
	}
}
