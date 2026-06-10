// Import requirements
import { join } from 'path';
import { copyFileSync, existsSync, mkdirSync, readdirSync, statSync } from 'fs';

function copyRecursiveSync(src: string, dest: string): void {
	const stats = statSync(src);
	const exists = existsSync(src);
	const isDirectory = exists && stats.isDirectory();

	if (isDirectory) {
		mkdirSync(dest, { recursive: true });
		readdirSync(src).forEach(child => {
			copyRecursiveSync(join(src, child), join(dest, child));
		});
	} else {
		copyFileSync(src, dest);
	}
}

const sources = [
	'./locales.json',
	'./src/locales/',
	'tsconfig.json',
	'.env',
	'.gitignore',
	'package.json',
	'updater.js',
];

for (let i = 0; i < sources.length; i++) {
	copyRecursiveSync(
		join(process.cwd(), sources[i]),
		join(process.cwd(), `dist/${sources[i]}`),
	);
}

console.log('Application build is complete!');
