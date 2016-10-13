/**
 * ensure everything is built, and then run the server
 */
import * as WebpackDevServer from 'webpack-dev-server';
import { buildCompiler, buildWebpack } from './build-client';

export default async function () {
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
                "**": "http://localhost:9090"
            }
        });
        server.listen(8080, "localhost", function() {
            resolve();
        });
    });
}