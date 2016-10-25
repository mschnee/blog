import * as child_process from 'child_process';

import generateAll from './generate-all';

export default async function buildServer() {
    await generateAll();
    return new Promise((resolve, reject) => {
        child_process.exec('"./node_modules/.bin/tsc" -P ./server/tsconfig.json', (err, stdout, stderr) => {
            if (err) {
                reject(err);
            } else {
                resolve(stdout);
            }
        });
    });
}