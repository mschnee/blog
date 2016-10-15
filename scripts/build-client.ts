import * as webpack from 'webpack';
import * as path from 'path';

export function buildCompiler() {
    let configFile: string;
    if (process.env === 'production') {
        configFile = 'webpack.prod.ts';
    } else {
        configFile = 'webpack.dev.ts';
    }
    const config = require(path.resolve(process.cwd(), 'scripts', 'lib', configFile)).default;
    const compiler = webpack(config);

    return compiler;
}

export async function buildWebpack() {
    return new Promise((resolve, reject) =>{
        const compiler = buildCompiler();

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

            console.info('Build Webpack complete')

            resolve(stats);
        });
    });
}

export default buildWebpack;