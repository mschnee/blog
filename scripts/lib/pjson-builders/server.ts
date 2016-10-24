import * as fs from 'fs';

import { PbField, PbMessage, PbServiceMethod, PbService, toTsDeclaration } from './definitions';

const SERVER_DIR = 'services';

// todo this function hasn't been tested.
function buildServiceMethod(usefulServiceName: string, methodName: string, method: PbServiceMethod, fields: PbField[]): string {
    const lcName = methodName.toLowerCase();
    const camelcaseName = lcName.substring(0,1) + methodName.substring(1);

    if (lcName.substr(0, 4) === 'post') {
        return `    public ${camelcaseName}(request: Request, response: Response, body: ${method.request}): ${method.response} { throw new Error('Not implemented'); }\n`;
    } else {
        const methodParams = fields.map(toTsDeclaration).join(', ');
        return `    public ${camelcaseName}(request: Request, response: Response${methodParams ? ', ' + methodParams : ''}): ${method.response} { throw new Error('Not implemented'); }\n`;
    }
}

function buildInterfaceDefinition(usefulServiceName: string, methodName: string, method: PbServiceMethod, fields: PbField[]): string {
    const lcName = methodName.toLowerCase();
    const camelcaseName = lcName.substring(0,1) + methodName.substring(1);

    if (lcName.substr(0, 4) === 'post') {
        return `    ${camelcaseName}(request: Request, response: Response, body: ${method.request}): ${method.response};\n`;
    } else {
        const methodParams = fields.map(toTsDeclaration).join(', ');
        return `    ${camelcaseName}(request: Request, response: Response${methodParams ? ', ' + methodParams : ''}): ${method.response};\n`;
    }
}

function buildExpressDefinition(usefulServiceName: string, methodName: string, method: PbServiceMethod, fields: PbField[]): string {
    const lcName = methodName.toLowerCase();
    const camelcaseName = lcName.substring(0,1) + methodName.substring(1);

    if (lcName.substr(0, 4) === 'post') {
        return [
            `        this.app.post('/api/${usefulServiceName}/${camelcaseName}', (request, response) => {\n`,
            `            if (!this.handler || !this.handler.${camelcaseName}) {\n`,
            `                response.status(500);\n`,
            `                return response.end('\\'/api/${usefulServiceName}/${camelcaseName}\\' is defined but not implemented');\n`,
            `            }\n`,
            `            const result = this.handler.${camelcaseName}(request, response, JSON.parse(request.body));\n`,
            `            response.json(result);\n`,
            `        });\n`
        ].join('');
    } else {
        const type = camelcaseName.split(/(?=[A-Z])/);
        const methodParams = fields.map(field => `request.params.${field.name}`).join(', ');
        const pathParams = fields.filter(f => f.rule !== 'repeated').map(field => `/:${field.name}`).join('');
        return [
            `        this.app.${type[0]}('/api/${usefulServiceName}/${camelcaseName}${pathParams}', (request, response) => {\n`,
            `            if (!this.handler || !this.handler.${camelcaseName}) {\n`,
            `                response.status(500);\n`,
            `                return response.end('\\'/api/${usefulServiceName}/${camelcaseName}\\' is defined but not implemented');\n`,
            `            }\n`,
            `            const result = this.handler.${camelcaseName}(request, response${methodParams && ', ' + methodParams});\n`,
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
    serviceStream.write(`\nexport class ${serviceName} extends Controller {\n`);

    // define constructor
    serviceStream.write(`    private handler: I${serviceName};\n`);
    serviceStream.write(`    constructor(app: Express, handler: I${serviceName}) {\n`);
    serviceStream.write(`        super(app);\n`);
    serviceStream.write(`        this.handler = handler;\n`);

    // fill the express things
    expressDefinitions.forEach(m => serviceStream.write(m));
    serviceStream.write('    }\n');

    // define methods
    // serviceMethods.forEach(m => serviceStream.write(m));
    serviceStream.write('}\n\n');
}

export default function buildServer(json: any) {
    return new Promise((resolve, reject) => {
        if (! fs.existsSync('./generated')) {
            fs.mkdirSync('./generated');
        }

        if (! fs.existsSync('./generated/' + SERVER_DIR)) {
            fs.mkdirSync('./generated/' + SERVER_DIR);
        }

        const routerStream = fs.createWriteStream(`./generated/${SERVER_DIR}/router.ts`, {
            flags: 'w',
            encoding: 'utf8',
            autoClose: true
        });
        routerStream.addListener('close', resolve);
        routerStream.addListener('error', reject);

        routerStream.write('//Automatically generated service.\n\n');
        routerStream.write('import { Express } from \'express\';\n\n');

        const generatedImports: string[] = [];
        const controllerImports: string[] = [];
        const definitions: string[] = [];
        const assignments: string[] = [];

        JSON.parse(json).messages.forEach((ns: PbMessage) => {
            ns.services.forEach(service => {
                const usefulServiceName = service.name.toLowerCase().replace('service', '');
                const controllerNamne = service.name.replace('Service', 'Controller');

                writeServiceClass(usefulServiceName, ns.name, ns.messages, service);

                generatedImports.push(`import { ${controllerNamne} as Generated${controllerNamne} } from './${controllerNamne}';`);
                controllerImports.push(`import { ${controllerNamne} } from '../../server/Controllers';`);
                definitions.push(`let ${usefulServiceName}Controller: Generated${controllerNamne};`);
                assignments.push(`    ${usefulServiceName}Controller = new Generated${controllerNamne}(app, new ${controllerNamne});`);
            });
        });
        routerStream.write(generatedImports.join('\n'));
        routerStream.write('\n\n');
        routerStream.write(controllerImports.join('\n'));
        routerStream.write('\n\n');
        routerStream.write(definitions.join('\n'));
        routerStream.write('\n\n');
        routerStream.write('export default function initRoutes(app: Express) {\n');
        routerStream.write(assignments.join('\n'));
        routerStream.write('\n');
        routerStream.write('}\n\n');
        resolve(json);
    });
}
