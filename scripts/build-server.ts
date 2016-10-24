import * as ts from 'typescript';
import * as glob from 'glob';
import * as fs from 'fs';
import * as path from 'path';

import generateAll from './generate-all';

//const tsConfig = require('../server/tsconfig.json').compilerOptions;

// tsconfig.rootDirs = [
//     path.resolve(process.cwd(), 'server'),
//     path.resolve(process.cwd(), 'generated')
// ];

// tsconfig.outDir = path.resolve(process.cwd(), 'dist', 'server');
// const tsConfig: ts.CompilerOptions = {
//     outDir: '../dist/server',
//     module: ts.ModuleKind.CommonJS,
//     target: ts.ScriptTarget.ES6,
//     //allowSyntheticDefaultImports: true,
//     moduleResolution: ts.ModuleResolutionKind.NodeJs,
//     noImplicitAny: true,
//     noEmitOnError: true,
// }

const tsConfig: any = {
    "module": "commonjs",
    "moduleResolution": "node",
    "outDir": "../dist/server/",
    "target": "es6",
    "noImplicitAny": true,
    "removeComments": true,
    "preserveConstEnums": true
};

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
        compile(tsConfig, resolve, reject);
    });
}

export async function watchServer() {

}

async function compile(config: ts.CompilerOptions, resolve: (value?: any) => void, reject: (value?: any) => void) {
    try {
        await generateAll();
        testOutputDirectory();

        const files = glob.sync('./server/**/*.ts');

        let program = ts.createProgram(files, tsConfig);
        let emitResult = program.emit();
        let allDiagnostics = ts.getPreEmitDiagnostics(program).concat(emitResult.diagnostics);


        allDiagnostics.forEach(diagnostic => {
            let { line, character } = diagnostic.file.getLineAndCharacterOfPosition(diagnostic.start);
            let message = ts.flattenDiagnosticMessageText(diagnostic.messageText, '\n');
            console.log(`TS${diagnostic.code} - ${diagnostic.file.fileName} (${line + 1},${character + 1}): ${message}`);
        });

        if (emitResult.emitSkipped) {
            return reject('Build failed');
        } else {
            return resolve(emitResult);
        }
    } catch (e) {
        reject(e);
    }

}