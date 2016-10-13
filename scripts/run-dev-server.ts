/**
 * ensure everything is built, and then run the server
 */
import devServer from '../server';

export default async function runDevClient(port: number) {
    return new Promise((resolve, reject) => {
        devServer(port);
    });
}