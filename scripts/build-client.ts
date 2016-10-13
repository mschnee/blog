import * as webpack from 'webpack';
import * as path from 'path';

async function buildWebpack() {
    let configFile: string;
    if (process.env === 'production') {
        configFile = 'webpack.prod.ts';
    } else {
        configFile = 'webpack.dev.ts';
    }
    const config = require(path.resolve(process.cwd(), 'client', configFile)).default;
    const compiler = webpack(config);
}

export default buildWebpack;