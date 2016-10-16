import * as fs from 'fs';

import { PbField, PbMessage, PbServiceMethod, PbService } from './definitions';

export default function buildClient(json: any) {
    return new Promise((resolve, reject)=>{
        const clientStream = fs.createWriteStream('./generated/client.ts', { 
            flags: 'w',
            encoding: 'utf8',
            autoClose: true
        });

        clientStream.addListener('close', resolve);
        clientStream.addListener('error', reject);

        json.messages.forEach((ns: PbMessage) => {
            console.log(ns.services);
        });
        clientStream.end('\n');

        resolve(json);
    });
}