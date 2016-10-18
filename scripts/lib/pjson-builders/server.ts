import * as fs from 'fs';

import { PbField, PbMessage, PbServiceMethod, PbService } from './definitions';

const SERVER_DIR = 'services';

// todo this function hasn't been tested.
function buildServiceMethod(usefulServiceName: string, methodName: string, method: PbServiceMethod, fields: PbField[]): string {
    const lcName = methodName.toLowerCase();
    const camelcaseName = lcName.substring(0,1) + methodName.substring(1);

    if (lcName.substr(0, 4) === 'post') {
        return `    public ${camelcaseName}(request: Request, response: Response, body: ${method.request}): ${method.response} { throw new Error('Not implemented'); }\n`;
    } else {
        const methodParams = fields.map(field => `${field.name}${field.rule === 'optional' ? '?:' : ':'} ${field.type}`).join(', ');
        return `    public ${camelcaseName}(request: Request, response: Response${methodParams ? ', ' + methodParams : ''}): ${method.response} { throw new Error('Not implemented'); }\n`;
    }
}

function buildInterfaceDefinition(usefulServiceName: string, methodName: string, method: PbServiceMethod, fields: PbField[]): string {
    const lcName = methodName.toLowerCase();
    const camelcaseName = lcName.substring(0,1) + methodName.substring(1);

    if (lcName.substr(0, 4) === 'post') {
        return `    ${camelcaseName}(request: Request, response: Response, body: ${method.request}): ${method.response};\n`;
    } else {
        const methodParams = fields.map(field => `${field.name}${field.rule === 'optional' ? '?:' : ':'} ${field.type}`).join(', ');
        return `    ${camelcaseName}(request: Request, response: Response${methodParams ? ', ' + methodParams : ''}): ${method.response};\n`;
    }
}

function buildExpressDefinition(usefulServiceName: string, methodName: string, method: PbServiceMethod, fields: PbField[]): string {
    const lcName = methodName.toLowerCase();
    const camelcaseName = lcName.substring(0,1) + methodName.substring(1);
 
    if (lcName.substr(0, 4) === 'post') {
        return [
            `        this.app.post('/${usefulServiceName}/${camelcaseName}', (request, response) => {\n`,
            `            const result = this.${camelcaseName}(request, response, JSON.parse(request.body));\n`,
            `            response.json(result);\n`,
            `        });\n`
        ].join('');
    } else {
        const type = camelcaseName.split(/(?=[A-Z])/);
        const methodParams = fields.map(field => `request.params.${field.name}`).join(', ');
        const apiParams = fields.map(field => `/:${field.name}`).join('');
        return [
            `        this.app.${type}('/${usefulServiceName}/${camelcaseName}${apiParams}', (request, response) => {\n`,
            `            const result = this.${camelcaseName}(request, response${methodParams && ', ' + methodParams});\n`,
            `            response.json(result);\n`,
            `        });\n`
        ].join('');
    }
}

function writeServiceClass(usefulServiceName: string, namespaceName: string, types: PbMessage[], service: PbService) {
    // service.name -- each rpc
    const serviceFunctionNames = Object.keys(service.rpc);
    const serviceName = service.name.replace('Service', 'Controller');

    const serviceStream = fs.createWriteStream(`./generated/${SERVER_DIR}/${serviceName}.ts`, {
        flags: 'w',
        encoding: 'utf8',
        autoClose: true
    });

    const typeImports: string[] = [];
    const serviceMethods: string[] = [];
    const expressDefinitions: string[] = [];
    const interfaceDefinitions: string[] = [];

    serviceFunctionNames.forEach(rpcName => {
        const method = service.rpc[rpcName];
        const requestType = types.find( (t: PbMessage) => t.name === method.request);
        const requestFields = requestType && requestType.fields;

        typeImports.push(method.request);
        typeImports.push(method.response);
        serviceMethods.push(buildServiceMethod(usefulServiceName, rpcName, method, requestFields) );
        expressDefinitions.push(buildExpressDefinition(usefulServiceName, rpcName, method, requestFields));
        interfaceDefinitions.push(buildInterfaceDefinition(usefulServiceName, rpcName, method, requestFields));
    });

    // write imports
    serviceStream.write(`import { Express, Request, Response } from 'express';\n`);
    serviceStream.write(`import { Controller } from '../../server/lib/Controller';\n\n`);
    serviceStream.write(`import { ${namespaceName} } from '../types';\n\n`);
    Array.from(new Set(typeImports)).forEach(t => serviceStream.write(`import ${t} = ${namespaceName}.${t};\n`));

    // define interface
    serviceStream.write(`\nexport interface I${serviceName} {\n`);
    interfaceDefinitions.forEach(m => serviceStream.write(m));
    serviceStream.write(`} // export interface I${serviceName}\n`);

    // define class
    serviceStream.write(`\nexport class ${serviceName} extends Controller implements I${serviceName} {\n`);

    // define constructor
    serviceStream.write(`    constructor(app: Express) {\n`);
    serviceStream.write(`        super(app);\n`);

    // fill the express things
    expressDefinitions.forEach(m => serviceStream.write(m));
    serviceStream.write('    }\n\n');

    // define methods
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
                writeServiceClass(usefulServiceName, ns.name, ns.messages, service);
            });
        });

        resolve(json);
    });
}
