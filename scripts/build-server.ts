import * as ts from 'typescript';
import * as glob from 'glob';
const tsconfig = require('../server/tsconfig.json');

export default async function buildServer() {
    return new Promise((resolve, reject) => {
        const files = glob.sync('./server/**/*.ts');
        let program = ts.createProgram(files, tsconfig);
        let emitResult = program.emit();
        resolve(emitResult);
    });
}