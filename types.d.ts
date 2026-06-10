export interface IKv<T = null> {
	key: string;
	value: T;
}

export interface I18nOptions {
	locales: string[];
	directory?: string;
	defaultLocale: string;
}

export interface RawPartial {
	id: string;
	value: string;
}
