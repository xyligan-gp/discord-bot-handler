// Import class
import { Bot } from '../../app.class';
import { BotCommand } from '../command.class';

// Import requirements
import {
	CacheType,
	ChatInputCommandInteraction,
	EmbedBuilder,
	SlashCommandBuilder,
} from 'discord.js';

export default class PingCmd extends BotCommand {
	constructor(bot: Bot) {
		super(bot);

		this.cooldown = 30;

		this.meta = new SlashCommandBuilder()
			.setName('ping')
			.setDescription('Bot latency.');
	}

	async handle(
		interaction: ChatInputCommandInteraction<CacheType>,
	): Promise<void> {
		try {
			const reply = await interaction.reply({
				content: interaction.t('COMMANDS.PING.PROCESS'),

				flags: 'Ephemeral',
				withResponse: true,
			});

			const apiLatency = Math.abs(
				(reply.resource.message.createdTimestamp ?? Date.now()) -
					interaction.createdTimestamp,
			);
			const gatewayLatency = Math.round(this.bot.ws.ping);

			await interaction.editReply({
				content: null,

				embeds: [
					new EmbedBuilder()
						.setColor('Random')
						.setDescription(
							interaction.t(
								'COMMANDS.PING.RESPONSE',
								apiLatency.toString(),
								gatewayLatency.toString(),
							),
						),
				],
			});
		} catch (e) {
			this.bot.logger.error(e);
			return;
		}
	}
}
