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