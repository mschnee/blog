import buildWebpack from './build-client';
import generateAll from './generate-all';
import run from './run';

export default async function() {
    await run(generateAll);
    await run(buildWebpack);
}