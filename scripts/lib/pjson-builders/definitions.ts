export interface PbField {
    rule: string;
    type: string;
    name: string;
    id: number;
}

export interface PbMessage {
    name: string;
    fields: PbField[];
    messages?: PbMessage[];
    services?: PbService[];
}

export interface PbServiceMethod {
    request: string;
    response: string;
    options: any;
}

export interface PbService {
    name: string;
    options: any;
    rpc: { [methodName: string]: PbServiceMethod};
}

export function toType(type: string) {
    if (/(double|float)/.test(type)) {
        return 'number';
    } else if (/[su]?(int|fixed)(32|64)/.test(type)) {
        return 'number';
    }

    return type;
}

export function toTsDeclaration(field: PbField): string {
    let tsType = toType(field.type);

    return field.name + (field.rule === 'optional' ? '?: ' : ': ') + tsType + (field.rule === 'repeated' ? '[]' : '');
}