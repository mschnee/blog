/**
 * Generates all APIs
 */
import getJsonDescriptors from './lib/getJsonDescriptors';
import buildTypes from './lib/pjson-builders/types';
import buildClient from './lib/pjson-builders/client';

export default function() {
    return getJsonDescriptors().then(buildTypes)
        .then(buildClient)
        //.then(buildServer);
}