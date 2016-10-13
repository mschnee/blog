import * as webpack from 'webpack';
import * as path from 'path';

export function buildCompiler() {
    let configFile: string;
    if (process.env === 'production') {
        configFile = 'webpack.prod.ts';
    } else {
        configFile = 'webpack.dev.ts';
    }
    const config = require(path.resolve(process.cwd(), 'client', configFile)).default;
    const compiler = webpack(config);

    return compiler;
}

async function buildWebpack() {
    return new Promise((reject, resolve) =>{
        const compiler = buildCompiler();

        compiler.run( (err, stats) => {
            if (err) {
                reject(err);
            }
            const jsonStats = stats.toJson('minimal');
            
            if (stats.hasErrors()) {
                reject(jsonStats.errors);
            }

            resolve(stats);
        });
    });
}

export default buildWebpack;