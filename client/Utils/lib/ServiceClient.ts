import { Client } from './Client';

export class ServiceClient {
    protected client: Client;
    public setClient(client: Client) {
        this.client = client;
    }
}