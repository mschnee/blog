import * as ts from 'typescript';
import * as glob from 'glob';
import * as fs from 'fs';
const tsconfig = require('../server/tsconfig.json').compilerOptions;

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
        testOutputDirectory();
        const files = glob.sync('./server/**/*.ts');
        console.log(tsconfig);
        let program = ts.createProgram(files, tsconfig);
        let emitResult = program.emit();
        resolve(emitResult);
    });
}

export async function watchServer() {
    return new Promise((resolve, reject) => {
        testOutputDirectory();
        const files = glob.sync('./server/**/*.ts');
        tsconfig.watch = true;
        console.log(tsconfig);
        let program = ts.createProgram(files, tsconfig);
        let emitResult = program.emit();
        resolve(emitResult);
    });
}