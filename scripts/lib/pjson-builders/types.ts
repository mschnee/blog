import * as fs from 'fs';
import * as stream from 'stream';

import { PbField, PbMessage, PbServiceMethod, PbService, toTsDeclaration } from './definitions';

export default function buildTypes(json: any) {
    return new Promise((resolve, reject)=>{
        if (!fs.existsSync('./server/generated')) {
            fs.mkdirSync('./server/generated');
        }
        if (!fs.existsSync('./client/generated')) {
            fs.mkdirSync('./client/generated');
        }

        const serverStream = fs.createWriteStream('./server/generated/types.ts', {
            flags: 'w',
            encoding: 'utf8',
            autoClose: true
        });

        const clientStream = fs.createWriteStream('./client/generated/types.ts', {
            flags: 'w',
            encoding: 'utf8',
            autoClose: true
        });

        const writeStream = new stream.Writable({
            write(chunk, encoding, callback) {
                clientStream.write(chunk);
                serverStream.write(chunk);
                callback();
            }
        });

        writeStream.write('// Automatically generated.  Don\'t modify it!! Have fun!\n');
        const jp = JSON.parse(json);
        jp.messages.forEach((ns: PbMessage) => {
            if (ns.messages && ns.messages.length) {
                writeStream.write(`export namespace ${ns.name} {\n`);
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