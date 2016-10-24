/**
 * ensure everything is built, and then run the server
 */

export default async function runDevServer(port: number = 8081) {
    return new Promise((resolve, reject) => {
        let devServer = require('../server/run-server').default;
        devServer(port);
    });
}