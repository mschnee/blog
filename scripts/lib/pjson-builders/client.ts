import * as fs from 'fs';

import { PbField, PbMessage, PbServiceMethod, PbService, toTsDeclaration } from './definitions';

const CLIENT_DIR = 'clientServices';

function buildServiceMethod(usefulServiceName: string, methodName: string, method: PbServiceMethod, fields: PbField[]): string {
    const lcName = methodName.toLowerCase();
    const camelcaseName = lcName.substring(0,1) + methodName.substring(1);
    if (lcName.substr(0, 4) === 'post') {
        return [
            `    ${camelcaseName}(request: ${method.request}) {`,
            `        return this.client.post<${method.response}>('/api/${usefulServiceName}/${camelcaseName}', request);`,
            '    }\n'
        ].join('\n');
    } else {
        const type = camelcaseName.split(/(?=[A-Z])/);
        const methodParams = fields.map(toTsDeclaration).join(', ');
        const pathParams = fields.filter(f => f.rule !== 'repeated').map(f => '${' + f.name + '}').join('/');
        const apiParamVar = fields.filter(f => f.rule === 'repeated').map(f => f.name).join(', ');
        const result = [
            `    ${camelcaseName}(${methodParams}) {`,
        ];
        if (apiParamVar && apiParamVar.length) {
            result.push(`        const apiParams = encodeURIComponent(JSON.stringify({${apiParamVar}}));`)
        }

        result.push(`        return this.client.${type[0]}<${method.response}>(\`/api/${usefulServiceName}/${camelcaseName}${pathParams ? '/' + pathParams : ''}${apiParamVar && apiParamVar.length ? '?${apiParams}': ''}\`);`);
        result.push('    }\n');
        return result.join('\n');
    }
}

function writeServiceClass(usefulServiceName: string, namespaceName: string, types: PbMessage[], service: PbService) {
    // service.name -- each rpc
    const serviceFunctionNames = Object.keys(service.rpc);

    const serviceStream = fs.createWriteStream(`./client/generated/services/${service.name}.ts`, {
        flags: 'w',
        encoding: 'utf8',
        autoClose: true
    });

    serviceStream.write(`import { ServiceClient } from '../../Utils/lib/ServiceClient';\n\n`);

    const typeImports: string[] = [];
    const serviceMethods: string[] = [];

    serviceFunctionNames.forEach(rpcName => {
        const method = service.rpc[rpcName];
        const requestType = types.find( (t: PbMessage) => t.name === method.request);
        const requestFields = requestType && requestType.fields;

        typeImports.push(method.request);
        typeImports.push(method.response);
        serviceMethods.push(buildServiceMethod(usefulServiceName, rpcName, method, requestFields));
    });

    serviceStream.write(`import { ${namespaceName} } from '../types';\n\n`);
    Array.from(new Set(typeImports)).forEach(t => serviceStream.write(`import ${t} = ${namespaceName}.${t};\n`));
    serviceStream.write(`\nexport class ${service.name} extends ServiceClient {\n`);
    serviceMethods.forEach(m => serviceStream.write(m));
    serviceStream.write('}\n\n');
}

export default function buildClient(json: any) {
    return new Promise((resolve, reject) => {
        if (! fs.existsSync('./client/generated')) {
            fs.mkdirSync('./client/generated');
        }

        if (! fs.existsSync('./client/generated/services')) {
            fs.mkdirSync('./client/generated/services');
        }

        const clientStream = fs.createWriteStream('./client/generated/client.ts', {
            flags: 'w',
            encoding: 'utf8',
            autoClose: true
        });

        clientStream.addListener('close', resolve);
        clientStream.addListener('error', reject);

        clientStream.write('//Automatically generated service.\n\n');
        clientStream.write('import { Client } from \'../Utils/lib/Client\';\n');

        const imports: string[] = [];
        const exports: string[] = [];
        const initLine: string[] = [];

        JSON.parse(json).messages.forEach((ns: PbMessage) => {
            ns.services.forEach(service => {
                const usefulServiceName = service.name.toLowerCase().replace('service', '');
                imports.push(`import { ${service.name} } from './services/${service.name}';\n`);
                exports.push(`    export const ${usefulServiceName} = new ${service.name}();\n`);
                initLine.push(`    Services.${usefulServiceName}.setClient(client);\n`);
                writeServiceClass(usefulServiceName, ns.name, ns.messages, service);
            });
        });

        imports.forEach(line => clientStream.write(line));

        clientStream.write('export namespace Services {\n');
        exports.forEach(line => clientStream.write(line));

        clientStream.write('} // export namespace Services \n\n');

        // export a useful function
        clientStream.write('export function setClientForAllServices(client: Client) {\n');
        initLine.forEach(m => clientStream.write(m));
        clientStream.write('}\n');

        // end it all
        clientStream.end('\n');

        resolve(json);
    });
}