// Import bot
import { Bot } from '../app.class';

// Import requirements
import { join } from 'path';
import { readFile } from 'fs/promises';
import {
	ButtonInteraction,
	ChatInputCommandInteraction,
	Collection,
} from 'discord.js';

// Import types
import { I18nOptions, RawPartial } from '../../types';

export class I18nService {
	#config: I18nOptions;
	#locales: Collection<string, Record<string, string>>;
	#partials: RawPartial[];

	constructor(options: I18nOptions) {
		this.#config = options;
		this.#locales = new Collection();
		this.#partials = [];
	}

	/**
	 * 📌 Search for and format a phrase in i18n files.
	 */
	public t(locale: string, key: string, ...args: string[]): string {
		const keys = key.split('.');

		let lTranslations: any =
			this.#locales.get(locale) ||
			this.#locales.get(this.#config.defaultLocale);

		for (let i = 0; i < keys.length; i++) {
			const currentKey = keys[i];

			if (!(currentKey in lTranslations)) {
				return null;
			}

			lTranslations = lTranslations[currentKey];
		}

		for (const partial of this.#partials) {
			lTranslations = lTranslations.replace(partial.id, partial.value);
		}

		return this.#replaceArgs(lTranslations, ...args);
	}

	/**
	 * 📌 Registering `{PARTIAL}` placeholders for replacement in i18n strings.
	 */
	public registerPartials(...partials: RawPartial[]): void {
		this.#partials.push(...partials);
	}

	/**
	 * 📌 Loading available i18n localizations.
	 */
	public async loadTranslations(): Promise<void> {
		const { locales, directory } = this.#config;

		for (const locale of locales) {
			const filePath = join(process.cwd(), directory, `${locale}.json`);
			const fileContents = await readFile(filePath, 'utf8');
			const lTranslations: Record<string, string> = JSON.parse(fileContents);

			this.#locales.set(locale, lTranslations);
		}
	}

	/**
	 * 📌 Find and replace phrase args.
	 */
	#replaceArgs(phrase: string, ...args: string[]): string {
		for (let i = 0; i < args.length; i++) {
			phrase = phrase.replace(`{${i + 1}}`, args[i]);
		}

		return phrase;
	}
}

declare module 'discord.js' {
	export interface ButtonInteraction {
		t(key: string, ...args: string[]): string;
	}

	export interface ChatInputCommandInteraction {
		t(key: string, ...args: string[]): string;
	}
}

ButtonInteraction.prototype.t = function (key, ...args) {
	return (this.client as Bot).i18n.t(this.locale, key, ...args);
};

ChatInputCommandInteraction.prototype.t = function (key, ...args) {
	return (this.client as Bot).i18n.t(this.locale, key, ...args);
};
