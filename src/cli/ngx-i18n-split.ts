/**
 * Copyright (c) 2019 Alexey Frolov
 * Based on https://github.com/AlexDaSoul/ngx-i18n-combine
 * Copyright (c) 2018 Olivier Combe
 */
import * as yargs from 'yargs';

import {
    ISplitOptions,
    ISplit,
    ICompiller,
    IExtractor,
    Split,
    Extractor,
    Compiler
} from '../index';

export const cli = yargs
    .usage('Split locale files.\nUsage: $0 [options]')
    .version(require(`${__dirname}/../../package.json`).version)
    .alias('version', 'v')
    .help('help')
    .alias('help', 'h')
    .option('input', {
        alias: 'i',
        describe: 'Paths you would like to split files from. You can use path expansion, glob patterns and multiple paths',
        default: process.env.PWD,
        type: 'array',
        normalize: true
    })
    .option('output', {
        alias: 'o',
        describe: 'Paths where you would like to save files.',
        type: 'string',
        normalize: true,
        required: true
    })
    .option('keys', {
        alias: 'k',
        describe: 'Keys which must be extracted from files.',
        type: 'array',
        normalize: true,
        required: true
    })
    .option('defaultFolder', {
        alias: 'd',
        describe: 'Folder for keys which mustn\'t br extracted.',
        default: '',
        type: 'string'
    })
    .option('indent', {
        alias: 'it',
        describe: 'Output format indentation',
        default: '\t',
        type: 'string'
    })
    .option('sort', {
        alias: 's',
        describe: 'Sort strings in alphabetical order when saving',
        default: false,
        type: 'boolean'
    })
    .option('minify', {
        alias: 'm',
        describe: 'Minify strings in output files',
        default: false,
        type: 'boolean'
    })
    .option('verbose', {
        alias: 'vb',
        describe: 'Log all output to console',
        default: true,
        type: 'boolean'
    })
    .option('watch', {
        alias: 'w',
        describe: 'Watch changes',
        default: false,
        type: 'boolean'
    })
    .exitProcess(true)
    .parse(process.argv);

/** Set Options from CLI */
const options: ISplitOptions = {
    input: cli.input,
    output: cli.output,
    indent: cli.indent,
    sort: cli.sort,
    minify: cli.minify,
    verbose: cli.verbose,
    watch: cli.watch,
    keys: cli.keys,
    defaultFolder: cli.defaultFolder
};

/**
 * Init Extractor
 *
 * @type {IExtractor}
 * @param {ISplitOptions}
 */
const parser: IExtractor = new Extractor(options);

/**
 * Init Compiler
 *
 * @type {ICompiller}
 * @param {ISplitOptions}
 */
const extractor: ICompiller = new Compiler(options);

/**
 * Init Split
 *
 * @type {ISplit}
 * @param {IExtractor}
 * @param {ICompiller}
 */
const split: ISplit = new Split(options, parser, extractor);

/** CLI Task Run */
split.run();
