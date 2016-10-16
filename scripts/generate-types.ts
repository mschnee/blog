/**
 * Generates all APIs
 */
import getJsonDescriptors from './lib/getJsonDescriptors';
import buildTypes from './lib/pjson-builders/types';

export default function() {
    return getJsonDescriptors().then(buildTypes);
}