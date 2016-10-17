import * as fs from 'fs';

import { PbField, PbMessage, PbServiceMethod, PbService } from './definitions';

function findType(json: any, service: string, typeName: string) {

}

const CLIENT_DIR = 'clientServices';

function buildMethodString(field: PbField) {
    return `${field.name}${field.rule === 'optional' ? '?:' : ':'} ${field.type}`;
}

function buildServiceMethod(usefulServiceName: string, methodName: string, method: PbServiceMethod, fields: PbField[]): string {
    const lcName = methodName.toLowerCase();
    const camelcaseName = lcName.substring(0,1) + methodName.substring(1);
    if (lcName.substr(0, 4) === 'post') {
        return [
            `    ${camelcaseName}(request: ${method.request}) {`,
            `        return this.client.post<${method.response}>('${usefulServiceName}/${camelcaseName}', request);`,
            '    }\n'
        ].join('\n');
    } else {
        const type = camelcaseName.split(/(?=[A-Z])/);
        const methodParams = fields.map(field => `${field.name}${field.rule === 'optional' ? '?:' : ':'} ${field.type}`).join(', ');
        const apiParams = fields.map(field => `/\`\${${field.name}}\``).join('');
        return [
            `    ${camelcaseName}(${methodParams}) {`,
            `        return this.client.${type[0]}<${method.response}>('${usefulServiceName}/${camelcaseName}${apiParams}');`,
            '    }\n'
        ].join('\n');
    }
}

function writeServiceClass(usefulServiceName: string, namespaceName: string, fields: PbField[], service: PbService) {
    // service.name -- each rpc
    const serviceFunctionNames = Object.keys(service.rpc);
    
    const serviceStream = fs.createWriteStream(`./generated/${CLIENT_DIR}/${service.name}.ts`, {
        flags: 'w',
        encoding: 'utf8',
        autoClose: true
    });

    serviceStream.write(`import { ServiceClient } from '../../client/Utils/lib/ServiceClient';\n\n`);
    
    const typeImports: string[] = [];
    const serviceMethods: string[] = [];

    serviceFunctionNames.forEach(rpcName => {
        const method = service.rpc[rpcName];
        typeImports.push(method.request);
        typeImports.push(method.response);
        serviceMethods.push(buildServiceMethod(usefulServiceName, rpcName, method, fields));
    });

    serviceStream.write(`import { ${namespaceName} } from '../types';\n\n`);
    Array.from(new Set(typeImports)).forEach(t => serviceStream.write(`import ${t} = ${namespaceName}.${t};\n`));
    serviceStream.write(`\nexport class ${service.name} extends ServiceClient {\n`);
    serviceMethods.forEach(m => serviceStream.write(m));
    serviceStream.write('}\n\n');
}

export default function buildClient(json: any) {
    return new Promise((resolve, reject) => {
        if (! fs.existsSync('./generated/' + CLIENT_DIR)) {
            fs.mkdirSync('./generated/' + CLIENT_DIR);
        }

        const clientStream = fs.createWriteStream('./generated/client.ts', { 
            flags: 'w',
            encoding: 'utf8',
            autoClose: true
        });

        clientStream.addListener('close', resolve);
        clientStream.addListener('error', reject);

        clientStream.write('//Automatically generated service.\n\n');
        
        const imports: string[] = [];
        const exports: string[] = [];

        json.messages.forEach((ns: PbMessage) => {
            ns.services.forEach(service => {
                const usefulServiceName = service.name.toLowerCase().replace('service', '');
                imports.push(`import { ${service.name} } from './${CLIENT_DIR}/${service.name}';\n`);
                exports.push(`    export const ${usefulServiceName} = new ${service.name}();\n`);
                writeServiceClass(usefulServiceName, ns.name, ns.fields, service);
            });
        });

        imports.forEach(line => clientStream.write(line));

        clientStream.write('export namespace Services {\n');
        exports.forEach(line => clientStream.write(line));

        clientStream.write('} // export namespace Services \n\n');
        clientStream.end('\n');

        resolve(json);
    });
}

/**
 
services.blog.get().then()
services.category.post({name: 'new category'}).then()
 */