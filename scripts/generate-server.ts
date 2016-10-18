/**
 * Generates all APIs
 */
import getJsonDescriptors from './lib/getJsonDescriptors';
import buildServer from './lib/pjson-builders/server';

export default function generateServer() {
    return getJsonDescriptors().then(buildServer);
}