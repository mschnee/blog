import * as ts from 'typescript';
import * as glob from 'glob';
import * as fs from 'fs';
import * as path from 'path';

import generateAll from './generate-all';

const tsconfig = require('../server/tsconfig.json').compilerOptions;

tsconfig.rootDirs = [
    path.resolve(process.cwd(), 'server'),
    path.resolve(process.cwd(), 'generated')
];

tsconfig.outDir = path.resolve(process.cwd(), 'dist', 'server');

function testOutputDirectory() {
    if (!fs.existsSync('./dist')) {
        fs.mkdirSync('./dist');
    }

    if (!fs.existsSync('./dist/server')) {
        fs.mkdirSync('./dist/server');
    }
}
export default async function buildServer() {
    return new Promise((resolve, reject) => {
        compile(tsconfig, resolve, reject);
    });
}

export async function watchServer() {
    return new Promise((resolve, reject) => {
        tsconfig.watch = true;
        compile(tsconfig, resolve, reject);
    });
}

async function compile(config: any, resolve: (value?: any) => void, reject: (value?: any) => void) {
    await generateAll();
    testOutputDirectory();

    const files = glob.sync('./server/**/*.ts');
    console.log(config);
    let program = ts.createProgram(files, tsconfig);
    let emitResult = program.emit();

    if (emitResult.emitSkipped) {
        return reject(emitResult.diagnostics.map(d => d.messageText).join('\n'));
    } else {
        return resolve(emitResult);
    }
}