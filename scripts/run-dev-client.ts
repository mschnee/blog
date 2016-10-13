/**
 * ensure everything is built, and then run the server
 */
import * as WebpackDevServer from 'webpack-dev-server';
import { buildCompiler, buildWebpack } from './build-client';

export default async function runDevClient(port: number, proxyPort: number) {
    await buildWebpack();
    return new Promise((resolve, reject) => {
        const server = new WebpackDevServer(buildCompiler(), {
            contentBase: './dist',
            publicPath: "/",
            stats: {colors: true},
            watchOptions: {
                aggregateTimeout: 300,
                poll: 1000
            },
            proxy: {
                "**": `http://localhost:${proxyPort || 9000}`
            }
        });
        server.listen(port, "localhost", function() {
            resolve();
        });
    });
}