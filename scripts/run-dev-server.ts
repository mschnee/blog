var nodemon = require('nodemon');
import buildServer, { watchServer } from './build-server';
import * as path from 'path';

/**
 * ensure everything is built, and then run the server
 */

export default async function runDevServer(port: number = 8081) {
    await buildServer();
    return new Promise((resolve, reject) => {
        watchServer();
        nodemon({
            script: path.join(process.cwd(), 'dist', 'server', 'index.js')
        });
    });
}