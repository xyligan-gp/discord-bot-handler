// Import class
import { Bot } from '../app.class';

// Import requirements
import { join } from 'path';
import { readdirSync } from 'fs';
import { pathToFileURL, fileURLToPath } from 'url';

declare const require: any;

// Import types
import { IKv } from '../../types';

export class UtilService {
	constructor(private readonly bot: Bot) {}

	/**
	 * 📌 Loading the contents of a file into a separate array.
	 */
	public async loadFiles<T = null>(dir: string): Promise<IKv<T>[]> {
		const values: IKv<T>[] = [];
		const foldersPath = join(process.cwd(), dir);

		const fileFolders = readdirSync(foldersPath).filter(
			f => !f.includes('class'),
		);

		for (const f of fileFolders) {
			const commandsPath = join(foldersPath, f);
			const commandFiles = readdirSync(commandsPath).filter(
				file => file.endsWith('.ts') || file.endsWith('.js'),
			);

			for (const file of commandFiles) {
				const filePath = join(commandsPath, file);
				const fileUrl = pathToFileURL(filePath).href;

				let imported = null;

				try {
					imported = await import(fileUrl);
				} catch {
					imported = require(fileURLToPath(fileUrl));
				}

				const resolvedImport = imported.default ?? imported;

				values.push({
					key: file,
					value: resolvedImport,
				});
			}
		}

		return values;
	}

	/**
	 * 📌 Registering custom emojis for the bot (https://discord.com/developers/applications/YOUR_BOT_ID/emojis).
	 */
	public registerEmojis(...emojis: Record<string, string>[]): void {
		this.bot.customEmojis = Object.assign({}, this.bot.customEmojis, ...emojis);
	}
}
