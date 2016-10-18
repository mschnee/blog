/**
 * Generates all APIs
 */
import getJsonDescriptors from './lib/getJsonDescriptors';
import buildTypes from './lib/pjson-builders/types';
import buildClient from './lib/pjson-builders/client';
import buildServer from './lib/pjson-builders/server';

export default function generateAll() {
    return getJsonDescriptors().then(buildTypes)
        .then(buildClient)
        .then(buildServer);
}