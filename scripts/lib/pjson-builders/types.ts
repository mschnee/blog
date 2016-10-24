import * as fs from 'fs';

import { PbField, PbMessage, PbServiceMethod, PbService, toTsDeclaration } from './definitions';

export default function buildTypes(json: any) {
    return new Promise((resolve, reject)=>{
        if (! fs.existsSync('./generated')) {
            fs.mkdirSync('./generated');
        }

        const writeStream = fs.createWriteStream('./generated/types.ts', {
            flags: 'w',
            encoding: 'utf8',
            autoClose: true
        });

        writeStream.addListener('close', resolve);
        writeStream.addListener('error', reject);

        writeStream.write('// Automatically generated.  Don\'t modify it!! Have fun!\n');
        JSON.parse(json).messages.forEach((ns: PbMessage) => {
            if (ns.messages && ns.messages.length) {
                writeStream.write(`namespace ${ns.name} {\n`);
                ns.messages.forEach((message: PbMessage) => {
                    writeStream.write(`    export interface ${message.name} {\n`);
                    if (message.fields && message.fields.length) {
                        message.fields.forEach(field =>{
                            writeStream.write(`        ${toTsDeclaration(field)};\n`);
                        });
                    }
                    writeStream.write(`    } // export interface ${message.name}\n\n`);
                });
                writeStream.write(`} // namespace ${ns.name}\n\n`);
            }
        });
        writeStream.end('\n');

        resolve(json);
    });
}