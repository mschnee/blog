import { LoggerInstance } from 'winston';
import { ServerConfiguration } from './configuration/ServerConfiguration';

export let logger: LoggerInstance;
export let config: ServerConfiguration;

export function setLogger(l: LoggerInstance) {
    logger = l;
}

export function setConfig(c: ServerConfiguration) {
    config = c;
}