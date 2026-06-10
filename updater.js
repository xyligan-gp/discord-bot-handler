/**
 * 🔍 Check for newer versions of dependencies in package.json
 *
 * This script compares the installed and latest versions of each dependency
 * (dependencies + devDependencies) and outputs a clear summary table.
 */
const { resolve } = require('path');
const { readFileSync } = require('fs');
const { createInterface } = require('readline');
const { execSync, exec } = require('child_process');

let counter = 0;
const PREFIX = '\x1b[35m[Updater]';
const path = resolve(process.cwd(), 'package.json');
const pkg = JSON.parse(readFileSync(path, 'utf8'));

const dependencies = new Map();

const deps = {
	...pkg.dependencies,
	...pkg.devDependencies,
};

if (!Object.keys(deps).length) {
	console.log(
		`${PREFIX}\x1b[31m No dependencies found in package.json!\x1b[0m`,
	);

	process.exit(0);
}

console.log(`${PREFIX}\x1b[33m Checking for newer versions...\x1b[0m`);

const results = [];

for (const [name, version] of Object.entries(deps)) {
	try {
		const current = version.replace(/^[^\d]*/, '');
		const latest = execSync(`npm view ${name} version`).toString().trim();

		const lat = formatPackageVersion(latest);
		const cur = formatPackageVersion(current);

		const isUpdate = lat > cur;

		results.push({
			Package: name,
			Current: current,
			Latest: latest,
			Update: isUpdate ? 'Available' : 'Up to date',
		});

		if (isUpdate) {
			counter++;
			dependencies.set(name, latest);
		}
	} catch {
		results.push({
			Package: name,
			Current: current,
			Latest: 'Unknown',
			Update: 'Unavailable',
		});
	}
}

if (!counter) {
	console.log(`${PREFIX}\x1b[32m >_ All dependencies are up to date!\x1b[0m`);
} else {
	console.table(results);

	const rl = createInterface({
		input: process.stdin,
		output: process.stdout,
	});

	rl.question(
		`${PREFIX}\x1b[33m Would you like to update all dependencies: (y/n) \x1b[0m`,
		async answer => {
			rl.close();

			if (answer[0] === 'y') {
				console.log(`\n${PREFIX}\x1b[31m >_ Starting update process...\x1b[0m`);

				let cmd = 'npm i ';

				for (const [name, version] of dependencies) {
					cmd += `${name}@${version} `;
				}

				exec(cmd, (e, stdout, stderr) => {
					dependencies.clear();

					console.log(
						`${PREFIX}\x1b[32m >_ All dependencies successfully updated!\x1b[0m`,
					);
				});
			} else {
				process.exit(0);
			}
		},
	);
}

function formatPackageVersion(version) {
	return parseInt(
		version
			.split('.')
			.map(n => n.padStart(2, '0'))
			.join(''),
	);
}
