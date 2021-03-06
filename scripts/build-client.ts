import * as webpack from 'webpack';
import * as path from 'path';

export function buildCompiler(watch?: boolean) {
    let configFile: string;

    if (process.env.NODE_ENV === 'production') {
        console.log('Using Production configuration');
        configFile = 'webpack.prod.ts';
    } else {
        console.log('Using Dev configuration');
        configFile = 'webpack.dev.ts';
    }
    const config = require(path.resolve(process.cwd(), 'scripts', 'lib', configFile)).default;
    if (watch) {
        config.devServer = {
            inline: true
        };
        config.plugins.push(new webpack.HotModuleReplacementPlugin);
    }
    const compiler = webpack(config);

    return compiler;
}

export async function buildWebpack() {
    return new Promise((resolve, reject) =>{
        const compiler = buildCompiler(false);

        compiler.run( (err, stats) => {
            if (err) {
                console.error("Webpack errors", err);
                reject(err);
            }
            const jsonStats = stats.toJson('minimal');

            if (stats.hasErrors()) {
                console.error("Webpack errors", jsonStats.errors);
                reject(jsonStats.errors);
            }

            console.info('Build Webpack complete');

            resolve(stats);
        });
    });
}

export default buildWebpack;