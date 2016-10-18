import { Express } from 'express';

export class Controller {
    app: Express;

    constructor(app: Express) {
        this.app = app;
    }
}