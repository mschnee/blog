import runDevClient from './run-dev-client';
import runDevServer from './run-dev-server';
import generateAll from './generate-all';

export default async function () {
    await generateAll();
    return new Promise((resolve, reject) => {
        runDevClient(8080, 8081);
        runDevServer(8081);
        resolve();
    });
}