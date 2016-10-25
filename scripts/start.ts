import runDevClient from './run-dev-client';
import watchServer from './watch-server';

export default async function () {
    return new Promise((resolve, reject) => {
        runDevClient(8080, 8081);
        watchServer(8081);
        resolve();
    });
}