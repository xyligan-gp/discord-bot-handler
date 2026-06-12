// Import class
import { Bot } from '../../app.class';
import { BotEvent } from '../event.class';

// Import requirements
import {
	CacheType,
	Collection,
	EmbedBuilder,
	Events,
	Interaction,
} from 'discord.js';

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
				const q = interaction.commandName;
				const cmd = this.bot.commands.get(q);

				if (cmd) {
					this.bot.logger.info(
						`[Command] User '${interaction.user.username}' (ID: ${
							interaction.user.id
						}) used '${cmd.meta.name}'!`,
					);

					if (!this.bot.cooldowns.has(cmd.meta.name)) {
						this.bot.cooldowns.set(cmd.meta.name, new Collection());
					}

					const now = Date.now();
					const timestamps = this.bot.cooldowns.get(cmd.meta.name);
					const cooldownAmount = cmd.cooldown * 1_000;

					if (timestamps.has(interaction.user.id)) {
						const expirationTime =
							timestamps.get(interaction.user.id) + cooldownAmount;

						if (now < expirationTime) {
							const expiredTimestamp = Math.round(expirationTime / 1_000);

							await interaction.reply({
								embeds: [
									new EmbedBuilder()
										.setColor('DarkRed')
										.setDescription(
											interaction.t(
												'DEFAULT.CMD_IS_COOLDOWNED',
												cmd.meta.name,
												`<t:${expiredTimestamp}:R>`,
											),
										),
								],

								flags: 'Ephemeral',
							});

							return;
						}
					}

					await cmd.handle(interaction);

					timestamps.set(interaction.user.id, now);

					setTimeout(
						() => timestamps.delete(interaction.user.id),
						cooldownAmount,
					);

					return;
				}
			}
		} catch (e) {
			this.bot.logger.error(e);
			return;
		}
	}
}
