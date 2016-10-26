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
console.log(process.env.NODE_ENV);
if (process.env && process.env.NODE_ENV === 'production') {
    try {
        let loadedConfig = JSON.parse(fs.readFileSync(config.config, 'utf8'));
        config = Object.assign({}, config, loadedConfig);

        console.log('Starting with config', config);

        // set production logging
        setLogger(new Logger({
            transports: [
                new transports.Console(),
                new transports.File({
                    name: 'errors',
                    filename: `${config.logDir}/error`,
                    level: 'error'
                }),
                new transports.File({
                    name: 'info',
                    filename: `${config.logDir}/log`,
                    level: 'info'
                })
            ],
            exceptionHandlers: [
                new transports.File({
                    name: 'exceptions',
                    filename: `${config.logDir}/exception`,
                })
            ]
        }));
    } catch (e) {
        setLogger(new Logger({
            transports: [
                new transports.Console()
            ],
            exceptionHandlers: [
                new transports.Console()
            ]
        }));
        logger.error('Error in startup', e);
    }
} else {
    setLogger(new Logger({
        transports: [
            new transports.Console(),
        ],
        exceptionHandlers: [
            new transports.Console()
        ]
    }));
}

setConfig(config);

runServer();