import runDevClient from './run-dev-client';
import runDevServer from './run-dev-server';

export default async function () {
    return new Promise((resolve, reject) => {
        runDevClient(8080, 8081);
        runDevServer(8081);
        resolve();
    });
}