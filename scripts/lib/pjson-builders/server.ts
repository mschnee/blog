import * as fs from 'fs';

import { PbField, PbMessage, PbServiceMethod, PbService } from './definitions';

const SERVER_DIR = 'services';

// todo this function hasn't been tested.
function buildServiceMethod(usefulServiceName: string, methodName: string, method: PbServiceMethod, fields: PbField[]): string {
    const lcName = methodName.toLowerCase();
    const camelcaseName = lcName.substring(0,1) + methodName.substring(1);
    if (lcName.substr(0, 4) === 'post') {
        return [
            `    @Post('/${usefulServiceName}/${camelcaseName}')`,
            `    ${camelcaseName}(@Body() request: ${method.request}) {`,
            `       return this.handler.${camelcaseName}(request)`,
            '    }\n'
        ].join('\n');
    } else {
        const type = camelcaseName.split(/(?=[A-Z])/);
        const methodParams = fields.map(field => `@Param('${field.name}') ${field.name}${field.rule === 'optional' ? '?:' : ':'} ${field.type}`).join(', ');
        const apiParams = fields.map(field => `/:\`\${${field.name}}\``).join('');
        return [
            `    @${type}(/${usefulServiceName}/${camelcaseName}${apiParams}')`,
            `    ${camelcaseName}(${methodParams}) {`,
            `        return this.client.${type[0]}<${method.response}>('${usefulServiceName}/${camelcaseName}${apiParams}');`,
            '    }\n'
        ].join('\n');
    }
}

function writeServiceClass(usefulServiceName: string, namespaceName: string, fields: PbField[], service: PbService) {
    // service.name -- each rpc
    const serviceFunctionNames = Object.keys(service.rpc);
    
    const serviceStream = fs.createWriteStream(`./generated/${SERVER_DIR}/${service.name}.ts`, {
        flags: 'w',
        encoding: 'utf8',
        autoClose: true
    });

    serviceStream.write(`import { Controller, Param, Body, Get, Post, Put, Delete } from 'routing-controllers';\n\n`);

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

export default function buildServer(json: any) {
    return new Promise((resolve, reject) => {
        if (! fs.existsSync('./generated/' + SERVER_DIR)) {
            fs.mkdirSync('./generated/' + SERVER_DIR);
        }

        json.messages.forEach((ns: PbMessage) => {
            ns.services.forEach(service => {
                const usefulServiceName = service.name.toLowerCase().replace('service', '');
                writeServiceClass(usefulServiceName, ns.name, ns.fields, service);
            });
        });

        resolve(json);
    });
}
