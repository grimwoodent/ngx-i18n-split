/**
 * Copyright (c) 2019 Alexey Frolov
 * Based on https://github.com/AlexDaSoul/ngx-i18n-combine
 * Copyright (c) 2018 Olivier Combe
 */
import * as chalk from 'chalk';
import * as fs from 'fs';
import * as path from 'path';
import * as mkdirp from 'mkdirp';
import * as sort from 'sort-keys';

import {
    ISplitOptions,
    ICompiller,
    ILocale,
    ILocales,
    IExtractedLocales,
} from './split.interfaces';

/**
 * Compiler class for generate
 * locale files from ILocales object
 *
 * @class
 * @implements {ICompiller}
 * @param {ISplitOptions}
 */
export class Compiler implements ICompiller {
    constructor(
        protected options: ISplitOptions
    ) { }

    /**
     * Split files
     *
     * @access public
     * @param extractedLocales {IExtractedLocales}
     * @return {void}
     */
    public compile(extractedLocales: IExtractedLocales): void {
        const filesPath = this.options.output;

        this.log(chalk.bold('\r\n Compile files to %s...'), filesPath);

        /** Get file directory */
        const directory: string = path.dirname(filesPath);

        /** Get file extname */
        const extname: string = path.extname(filesPath);

        /** Add directories if not found */
        mkdirp(directory, (err) => {
            if (err) {
                /** If error */
                this.log(chalk.bold.red('ERROR: directory is not added'));
            } else {
                const files = extractedLocales.locales;

                Object.keys(files).forEach(key => {
                    const keyDirectory = path.join(directory, key);

                    mkdirp(keyDirectory, (err) => {
                        if (err) {
                            /** If error */
                            this.log(chalk.bold.red('ERROR: directory is not added'));
                        } else {
                            const locales = files[key];

                            Object.keys(locales).forEach(locale => {
                                this.addFiles(keyDirectory, locale, extname, locales[locale]);
                            });
                        }
                    });
                });

                const defaultDirectory = this.options.defaultFolder
                    ? path.join(directory, this.options.defaultFolder)
                    : directory;

                mkdirp(defaultDirectory, (err) => {
                    if (err) {
                        /** If error */
                        this.log(chalk.bold.red('ERROR: directory is not added'));
                    } else {
                        const locales = extractedLocales.defaults;

                        Object.keys(locales).forEach(locale => {
                            this.addFiles(defaultDirectory, locale, extname, locales[locale]);
                        });
                    }
                });
            }
        });
    }

    /**
     * Add files
     *
     * @access public
     * @param {string}
     * @param {string}
     * @param {string}
     * @param {ILocales | ILocale}
     * @return {void}
     */
    protected addFiles(directory: string, name: string, extname: string, content: ILocales | ILocale): void {
        if (this.options.sort) {
            /** Sort ILocale */
            content = sort(content, { deep: true });

            /** Log */
            this.log(chalk.dim('- sorted strings'));
        }

        /** Set locale file path */
        const file: string = path.normalize(`${directory}/${name}${extname || '.json'}`);

        /** Tab for code style formatting */
        const indentation: string = !this.options.minify ? this.options.indent : null;

        /** Get file format type */
        const ifEsFormat = ['js', 'ts', 'tsx', 'jsx'].includes(name[1]);

        /** Set string from ILocale object */
        const contents: string = JSON.stringify(content, null, indentation);

        /** Set file type from format option */
        const formattedContents: string = ifEsFormat ? `export const ${name} = ${contents}` : contents;

        /** Create locale file */
        fs.writeFileSync(file, formattedContents, 'utf8');

        if (this.options.verbose) {
            /** Log results */
            this.log(chalk.gray('- %s'), file);
        }
    }

    /**
     * Console log wrapper
     *
     * @access protected
     * @param {Array<any>}
     * @return {void}
     */
    protected log(...args: any[]): void {
        console.log.apply(this, arguments);
    }
}
