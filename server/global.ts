import { LoggerInstance } from 'winston';

export let logger: LoggerInstance;

export function setLogger(l: LoggerInstance) {
    logger = l;
}