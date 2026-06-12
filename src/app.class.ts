// Import requirements
import pino from 'pino';
import { Client, Collection, GatewayIntentBits, Partials } from 'discord.js';

// Import services
import { I18nService } from './i18n/i18n.service';
import { UtilService } from './utils/utils.service';

// Import types
import { BotCommand } from './commands/command.class';
import { BotComponent } from './components/component.class';

export class Bot extends Client<true> {
	public logger: pino.Logger;

	public i18n: I18nService;
	public utils: UtilService;

	public commands: Collection<string, BotCommand>;
	public components: Collection<string, BotComponent>;
	public cooldowns: Collection<string, Collection<string, number>>;

	public customEmojis: Record<string, string>;

	constructor() {
		super({
			intents: [GatewayIntentBits.Guilds],
			partials: [Partials.Reaction],
		});

		this.logger = null;

		this.i18n = null;
		this.utils = new UtilService(this);

		this.commands = new Collection();
		this.components = new Collection();
		this.cooldowns = new Collection();

		this.customEmojis = {};
	}
}
