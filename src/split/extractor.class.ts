/**
 * Copyright (c) 2019 Alexey Frolov
 * Based on https://github.com/AlexDaSoul/ngx-i18n-combine
 * Copyright (c) 2018 Olivier Combe
 */
import * as chalk from 'chalk';
import * as glob from 'glob';
import * as fs from 'fs';
import * as root from 'app-root-path';
import * as path from 'path';

import { ISplitOptions, IExtractor, ILocale, ILocales, IExtractedLocales } from './split.interfaces';

/**
 * Extractor class for extract locale files and
 * generate ILocales object
 *
 * @class
 * @implements {IExtractor}
 * @param {ISplitOptions}
 */
export class Extractor implements IExtractor {
    /**
     * Object locales
     *
     * @access private
     * @type {ILocales}
     */
    protected locales: ILocales;

    protected defaults: ILocales;

    constructor(
        protected options: ISplitOptions
    ) { }


    /**
     * Parse locale files
     *
     * @access public
     * @return {ILocales}
     */
    public extract(): IExtractedLocales {
        this.log(chalk.bold('Read files...'));

        /** Init field with an empty object */
        this.locales = { };
        this.defaults = { };

        this.options.input.forEach((filesPath: string) => {
            /** Get Files array */
            const files: string[] = this.getFiles(filesPath);

            if (!files.length) {
                /** If files not found */
                this.log(chalk.bold.red('ERROR: files not found'));
            } else {
                /** Set ILocale from files */
                files.forEach((file: string) => this.setLocale(file));
            }
        });

        return {
            locales: this.locales,
            defaults: this.defaults,
        };
    }


    /**
     * Set Locale from file
     *
     * @access private
     * @param {String}
     * @return {void}
     */
    protected setLocale(file: string): void {
        /** Get file name */
        const fileName: string[] = path.basename(file).split('.');

        /** Read locale file */
        const contents: string = fs.readFileSync(file, 'utf-8');

        /** Get file format type */
        const ifEsFormat = ['js', 'ts', 'tsx', 'jsx'].includes(fileName[1]);

        /** ILocale JSON extract es format of json */
        const parseObject: ILocale = JSON.parse((ifEsFormat ? contents.split('=')[1].replace(';', '') : contents));

        if (!Object.keys(parseObject).length) {
            /** If file is empty */
            this.log(chalk.bold.red(`ERROR: File is empty: ${file}`));
        } else if (!this.options.keys.length) {
            /** If keys is empty */
            this.log(chalk.bold.red(`ERROR: Keys is empty`));
        } else {
            const keys = this.options.keys;

            if (this.options.verbose) {
                /** Log results */
                this.log(chalk.gray('- get %s from %s'), keys, file);
            }

            Object.keys(parseObject).forEach(key => {
                const resultsObject = {
                    [key]: {
                        ...parseObject[key],
                    },
                };

                if (keys.includes(key)) {
                    /** Set ILocale object */
                    this.locales[key] = this.locales[key] || { };
                    this.locales[key][fileName[0]] = this.locales[key][fileName[0]] ? {
                        ...this.locales[key][fileName[0]],
                        ...resultsObject,
                    } : resultsObject;
                } else {
                    /** Set ILocale object */
                    this.defaults[fileName[0]] = this.defaults[fileName[0]] ? {
                        ...this.defaults[fileName[0]],
                        ...resultsObject,
                    } : resultsObject;
                }
            });
        }
    }


    /**
     * Find files from input path
     *
     * @access private
     * @param {String}
     * @return {Array<string>}
     */
    protected getFiles(filePath: string): string[] {
        /** Pattern search if not ext */
        const pattern: string = '/**/*.json';

        /** Get file name */
        const fileName: boolean = !!(path.extname(filePath));

        /** Add path with pattern */
        const pathWp: string = fileName ? filePath : filePath + pattern;

        return glob.sync(pathWp, { root: root.path })
            .filter(file => fs.statSync(file).isFile());
    }

    /**
     * Console log wrapper
     *
     * @access private
     * @param {Array<any>}
     * @return {void}
     */
    protected log(...args: any[]): void {
        console.log.apply(this, arguments);
    }
}
