import * as child_process from 'child_process';
import * as path from 'path';

import buildServer from './build-server';

export default async function watchServer(port: number = 8081) {
    await buildServer();

    //child_process.exec('"./node_modules/.bin/tsc" -P ./server/tsconfig.json --watch');
    const err = (d: string | Buffer) => console.error(d.toString());
    const out = (d: string | Buffer) => console.log(d.toString());

    const watchSpawn = child_process.spawn(path.resolve(process.cwd(), './node_modules/.bin/tsc.cmd'), ['-P', './server/tsconfig.json', '--watch']);
    watchSpawn.stdout.on('data', out);
    watchSpawn.stderr.on('data', err);

    const nodemonSpawn = child_process.spawn(path.resolve(process.cwd(), './node_modules/.bin/nodemon.cmd'), ['./dist/server/index.js', `--port=${port}`]);
    nodemonSpawn.stdout.on('data', out);
    nodemonSpawn.stderr.on('data', err);
}