/**
 * ensure everything is built, and then run the server
 */
import * as WebpackDevServer from 'webpack-dev-server';
import { buildCompiler, buildWebpack } from './build-client';
import generateAll from './generate-all';

export default async function runDevClient(port: number = 8080, proxyPort: number = 8081) {
    await generateAll();
    await buildWebpack();
    return new Promise((resolve, reject) => {
        const server = new WebpackDevServer(buildCompiler(), {
            hot: true,
            //noInfo: true,
            contentBase: './dist/client',
            publicPath: "/",
            stats: {colors: true},
            watchOptions: {
                aggregateTimeout: 300,
                poll: 1000
            },
            proxy: {
                "/api/**": `http://localhost:${proxyPort}`
            },
            historyApiFallback: true,
        });
        server.listen(port, "localhost", function() {
            resolve();
        });
    });
}