/**
 * Generates all APIs
 */
import * as glob from 'glob';
import * as fs from 'fs';

var toJson = require('../../node_modules/protobufjs/cli/pbjs/targets/json');

import { loadProtoFile, newBuilder } from 'protobufjs';

function globHandler(matches: string[]) {
    return Promise.all(matches.map(promiseLoadProto));
}

function promiseLoadProto(protofileName: string) {
    return new Promise((resolve, reject) => {
        loadProtoFile(protofileName, (err, builder) => {
            if (err) {
                console.error('Error building', protofileName, err);
                reject(err);
            } else {
                console.log('built from', protofileName);
                resolve(builder);
            }
        }, builder);
    });
}

function promiseGlob(pattern: string) {
    return new Promise((resolve, reject) => {
        try {
            resolve(glob.sync(pattern));
        } catch (e) {
            reject(e);
        }
    });
}

let builder = newBuilder();

export default function getJsonDescriptors() {
    return promiseGlob('./protos/**/*.proto').then(globHandler).then(() =>{
        console.log('builder should be finished');
        let ret = toJson(builder);
        return JSON.parse(ret);
    });
}