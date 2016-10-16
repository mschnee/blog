import * as fs from 'fs';

import { PbField, PbMessage, PbServiceMethod, PbService } from './definitions';

export default function buildClient(json: any) {
    return new Promise((resolve, reject)=>{
        const writeStream = fs.createWriteStream('./generated/client.ts', { 
            flags: 'w',
            encoding: 'utf8',
            autoClose: true
        });

        writeStream.addListener('close', resolve);
        writeStream.addListener('error', reject);

        writeStream.write('// Automatically generated.  Don\'t modify it!! Have fun!\n');
        json.messages.forEach((ns: PbMessage) => {
            if (ns.messages && ns.messages.length) {
                writeStream.write(`export namespace ${ns.name} {\n`);
                ns.messages.forEach((message: PbMessage) => {
                    writeStream.write(`    export interface ${message.name} {\n`);
                    if (message.fields && message.fields.length) {
                        message.fields.forEach(field =>{
                            writeStream.write(`        ${field.name}${field.rule === 'optional'? '?:':':'} ${field.type};\n`);
                        });
                    }
                    writeStream.write(`    } // export interface ${message.name}\n\n`);
                });
                writeStream.write(`} // namespace ${ns.name}\n\n`);
            }
        });
        writeStream.end('\n');
    });
}