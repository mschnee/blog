import * as fs from 'fs';
import * as minimist from 'minimist';
import { Logger, transports } from 'winston';

import { setLogger, logger, setConfig } from './global';
import runServer from './run-server';
import { ServerConfiguration } from './configuration/ServerConfiguration';

const argv: ServerConfiguration = minimist(process.argv.slice(2));

let defaultConfig: ServerConfiguration = {
    config: '/etc/conf.d/blog.json',
    hostname: 'localhost',
    port: 8081,
    logDir: null
};

let config = Object.assign({}, defaultConfig, argv);

if (process.env && process.env.NODE_ENV === 'production') {
    try {
        let loadedConfig = fs.readFileSync(config.config);
        config = Object.assign({}, loadedConfig, config);
    } catch (e) {
        setLogger(new Logger({
            transports: [
                new transports.Console()
            ],
            exceptionHandlers: [
                new transports.Console()
            ]
        }));
        logger.error('nope!', e);
    }
} else {
    setLogger(new Logger({
        transports: [
            new transports.Console()
        ],
        exceptionHandlers: [
            new transports.Console()
        ]
    }));
}

setConfig(config);

runServer(config.port);