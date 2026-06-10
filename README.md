# discord-bot-handler

Discord bot handler written in TypeScript. This repository provides
a small framework for loading events, commands and components
dynamically and starting a Discord bot using discord.js.

## Features

- Dynamic loading of events, commands and components from `src/`
- Built-in i18n support using `src/locales` and `locales.json`
- Simple utilities for file loading and bootstrapping
- Production-ready build helper that copies runtime assets to `dist/`

## Prerequisites

- Node.js 18+ (or compatible) and npm
- A Discord bot token (set as `SECRET` in environment)

## Installation

Clone the repository and install dependencies:

```bash
git clone https://github.com/xyligan-gp/discord-bot-handler.git
cd discord-bot-handler
npm install
```

## Configuration

Create a `.env` file in the project root with at least the bot token:

```
SECRET=your_discord_bot_token
DEFAULT_LOCALE=en-US      # optional
DEBUG=false               # optional, set to true for debug logging
```

Locales are defined under `src/locales` and referenced by `locales.json`.

## Scripts

- `npm run dev` — start in development mode (uses `nodemon` + `tsx`)
- `npm run start` — run the compiled project (`node .`)
- `npm run build` — compile TypeScript (`tsc -p tsconfig.json`)
- `npm run build:prod` — compile and run `cp.ts` to copy runtime files to `dist/`
- `npm run updater` — run the updater script

Example: run in development:

```bash
npm run dev
```

## Build / Deployment notes

The `cp.ts` helper copies runtime assets (locales, `locales.json`, `tsconfig.json`,
.env, `package.json`, `updater.js`) into `dist/` so the compiled code can be
deployed in a single folder. Use `npm run build:prod` for a basic production
build flow.

## Project structure

Key folders and files:

- `index.ts` — program entry that instantiates `BotService`
- `src/app.service.ts` — bootstraps the bot, logger and i18n
- `src/app.class.ts` — `Bot` class extending `discord.js` Client
- `src/utils` — helper utilities (dynamic file loader)
- `src/commands` — command handlers
- `src/events` — event handlers
- `src/components` — component-like handlers
- `src/locales` — locale JSON files
- `locales.json` — list of available locales used by i18n

## Environment variables

- `SECRET` (required) — Discord bot token
- `DEFAULT_LOCALE` (optional) — default locale key from `locales.json`
- `DEBUG` (optional) — when `true` enables debug logging

## Contributing

Contributions are welcome. Open an issue or submit a pull request.

## License

This project is licensed under the Apache-2.0 License. See `LICENSE`.

## Author

xyligan — contact.csdevs@gmail.com

## Issues

Report bugs at: https://github.com/xyligan-gp/discord-bot-handler/issues
