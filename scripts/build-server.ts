import * as ts from 'typescript';
const tsconfig = require('../server/tsconfig.json');

export default async function buildServer() {
    return new Promise((resolve, reject) => {
        let program = ts.createProgram([], tsconfig);
        let emitResult = program.emit();
        resolve(emitResult);
    });
}