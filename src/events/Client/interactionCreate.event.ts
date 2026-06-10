// Import class
import { Bot } from '../../app.class';
import { BotEvent } from '../event.class';

// Import requirements
import { CacheType, Events, Interaction } from 'discord.js';

export default class InteractionCreateEvent extends BotEvent {
	constructor(bot: Bot) {
		super(bot);

		this.name = Events.InteractionCreate;
	}

	async handle(interaction: Interaction<CacheType>): Promise<void> {
		try {
			if (
				interaction.isButton() ||
				interaction.isStringSelectMenu() ||
				interaction.isModalSubmit()
			) {
				const id = interaction.customId;

				const component =
					this.bot.components.get(id.split(':')[0]) ??
					this.bot.components.get(id);

				if (component) {
					this.bot.logger.info(
						`[Component] User '${interaction.user.username}' (ID: ${
							interaction.user.id
						}) used '${component.name}'! CustomId -> '${interaction.customId}'`,
					);

					await component.handle(interaction);
					return;
				}
			}

			if (interaction.isChatInputCommand()) {
				const cName = interaction.commandName;
				const botCmd = this.bot.commands.get(cName);

				if (botCmd) {
					this.bot.logger.info(
						`[Command] User '${interaction.user.username}' (ID: ${
							interaction.user.id
						}) used '${botCmd.meta.name}'!`,
					);

					await botCmd.handle(interaction);
					return;
				}
			}
		} catch (e) {
			this.bot.logger.error(e);
			return;
		}
	}
}
