import { Format } from 'logform';
import { format } from 'winston';
import { NestLikeConsoleFormatOptions } from './logger.interfaces';

const clc = {
    bold: (text: string) => `\x1B[1m${text}\x1B[0m`,
    green: (text: string) => `\x1B[32m${text}\x1B[39m`,
    yellow: (text: string) => `\x1B[33m${text}\x1B[39m`,
    red: (text: string) => `\x1B[31m${text}\x1B[39m`,
    magentaBright: (text: string) => `\x1B[95m${text}\x1B[39m`,
    cyanBright: (text: string) => `\x1B[96m${text}\x1B[39m`,
};

const nestLikeColorScheme: Record<string, (text: string) => string> = {
    info: clc.green,
    error: clc.red,
    warn: clc.yellow,
    debug: clc.magentaBright,
    verbose: clc.cyanBright,
};

const APP_NAME = 'Nest';

function getValidValues(context: any = null) {
    if (!context) {
        return {
            isValidString: null,
            context: '',
        };
    }
    const isString: boolean = context === 'string';
    if (isString) {
        return {
            isValidString: true,
            context,
        };
    }
    const code: string = context?.statusCode ? `[${context?.statusCode}]` : '';
    const method: string = context?.method ? `[${context?.method}]` : '';
    const _function: string = context?.function ? `[${context?.function}]` : '';
    const controller: string = context?.controller
        ? `[${context?.controller}]`
        : '';
    return {
        isValidString: false,
        code,
        method,
        _function,
        controller,
    };
}

const getFormattedLogs = (appName = 'Nest', data: any = null): string => {
    const values = getValidValues(data.context);
    if (!values.isValidString) {
        const { code, controller, _function, method } = values;
        return `[${appName}] [${data?.level
            .toUpperCase()
            .padEnd(7)
            .trim()}] - ${
            data?.timestamp
        } ${controller} ${method} ${code} ${_function} ${data?.message}`;
    } else {
        return `[${appName}] [${data?.level
            .toUpperCase()
            .padEnd(7)
            .trim()}] - ${data?.timestamp} [${data?.context}] ${data?.message}`;
    }
};

const nestLikeConsoleFormat = (
    appName = 'Nest',
    options: NestLikeConsoleFormatOptions = {
        colors: !process.env.NO_COLOR,
        prettyPrint: false,
    }
): Format =>
    format.printf(({ context, level, timestamp, message, ms }) => {
        if (timestamp && timestamp === new Date(timestamp).toISOString()) {
            timestamp = new Date(timestamp).toLocaleString();
        }

        const color =
            (options.colors && nestLikeColorScheme[level]) ||
            ((text: string): string => text);

        const yellow = options.colors
            ? clc.yellow
            : (text: string): string => text;

        const _appName: string = color(`[${appName}]`) + ' ';

        const getContext = (): string => {
            const truthyValues = getValidValues(context);
            if (truthyValues?.isValidString === null) {
                return '';
            }

            if (!truthyValues?.isValidString) {
                const { code, method, controller, _function } = truthyValues;
                return `${clc.yellow(controller?.toString())} ${clc.green(
                    code?.toString()
                )} ${clc.green(method?.toString())} ${clc.green(
                    _function?.toString()
                )} `;
            } else {
                return `${clc.yellow(truthyValues?.context?.toString())} `;
            }
        };

        const _ms: string = ms ? ` ${yellow(ms)}` : '';
        const _timestamp: string = timestamp ? `${timestamp} ` : '';
        const _level = `${yellow(
            level?.charAt(0).toUpperCase() + level?.slice(1)
        )}\t`;

        return (
            _appName +
            _level.trimEnd() +
            '    ' +
            clc.green('-') +
            ' ' +
            _timestamp +
            '    ' +
            clc.green('LOG') +
            ' ' +
            getContext() +
            `${color(message)} - ` +
            _ms
        );
    });

export const utilities = {
    format: {
        nestLike: nestLikeConsoleFormat,
        getFormattedLogs,
    },
};
