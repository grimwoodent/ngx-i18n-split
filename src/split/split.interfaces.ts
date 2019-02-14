/**
 * Interface for locale hash tables {key: value}
 *
 * @interface
 */
export interface ILocale {
    [key: string]: any;
}

/**
 * Interface for locale's object with hash tables {key: ILocale}
 *
 * @interface
 */
export interface ILocales {
    [key: string]: ILocale;
}

export interface IExtractedLocales {
    locales: ILocales;
    defaults: ILocales;
}

/**
 * Interface for CLI options
 *
 * @interface
 */
export interface ISplitOptions {
    input: string[];
    output: string;
    keys: string[];
    defaultFolder?: string;
    indent?: string;
    locales?: string[];
    sort?: boolean;
    minify?: boolean;
    verbose?: boolean;
    watch?: boolean;
}

/**
 * Interface for public method of Extractor class
 *
 * @interface
 */
export interface IExtractor {
    extract(): IExtractedLocales;
}

/**
 * Interface for public method of Compiller class
 *
 * @interface
 */
export interface ICompiller {
    compile(extractedLocales: IExtractedLocales): void;
}

/**
 * Interface for public method of Split class
 *
 * @interface
 */
export interface ISplit {
    run(): void;
}