/**
 * Generates all APIs
 */
import getJsonDescriptors from './lib/getJsonDescriptors';
import buildClient from './lib/pjson-builders/client';

export default function generateClient() {
    return getJsonDescriptors().then(buildClient);
}