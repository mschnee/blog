import buildWebpack from './build-client';
import buildServer from './build-server';
import generateAll from './generate-all';
import run from './run';

export default async function() {
    await run(generateAll);
    await run(buildWebpack);
    await run(buildServer);
}