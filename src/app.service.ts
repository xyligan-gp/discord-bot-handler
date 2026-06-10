// Import class
import { Bot } from './app.class';

// Import requirements
import pino from 'pino';
import dotenv from 'dotenv';

// Import services
import { I18nService } from './i18n/i18n.service';

// Import locales
import locales from '../locales.json';

// Import types
import { BotEventConstructor } from './events/event.class';
import { BotCommandConstructor } from './commands/command.class';
import { BotComponentConstructor } from './components/component.class';

export class BotService {
	#instance: Bot;
	#locales: string[];

	constructor() {
		this.#instance = new Bot();

		dotenv.config();

		this.#instance.logger = pino({
			level: process.env.DEBUG === 'true' ? 'debug' : 'info',

			transport: {
				target: 'pino-pretty',
				options: { colorize: true },
			},
		});

		this.#locales = [];

		for (const l of locales) {
			this.#locales.push(l.value);
		}

		this.#instance.i18n = new I18nService({
			directory: 'src/locales',
			defaultLocale: process.env.DEFAULT_LOCALE,
			locales: this.#locales,
		});

		this.#load();
	}

	/**
	 * 📌
	 */
	async #load(): Promise<void> {
		const events =
			await this.#instance.utils.loadFiles<BotEventConstructor>('src/events');

		for (const Event of events) {
			const event = new Event.value(this.#instance);
			this.#instance.on(event.name, event.handle.bind(event));

			this.#instance.logger.debug(
				`🔵 | Event '${event.name}' successfully loaded!`,
			);
		}

		const commands =
			await this.#instance.utils.loadFiles<BotCommandConstructor>(
				'src/commands',
			);

		for (const Command of commands) {
			const command = new Command.value(this.#instance);
			this.#instance.commands.set(command.meta.name, command);

			this.#instance.logger.debug(
				`🔵 | Command '${command.meta.name}' successfully loaded!`,
			);
		}

		const components =
			await this.#instance.utils.loadFiles<BotComponentConstructor>(
				'src/components',
			);

		for (const Component of components) {
			const component = new Component.value(this.#instance);
			this.#instance.components.set(component.name, component);

			this.#instance.logger.debug(
				`🔵 | Component '${component.name}' successfully loaded!`,
			);
		}

		this.#start();
	}

	/**
	 * 📌 Start bot.
	 */
	#start(): void {
		this.#instance.login(process.env.SECRET);
	}
}
