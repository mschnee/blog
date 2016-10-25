import { buildCompiler } from './build-client';

async function watchWebpack() {
    return new Promise((resolve, reject) =>{
        const compiler = buildCompiler(true);

        compiler.watch({
            aggregateTimeout: 300,
            poll: true,
        }, (err, stats) => {
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

export default watchWebpack;