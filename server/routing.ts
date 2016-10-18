import { Express } from 'express';
import { BlogController } from './Controllers';

let blogController: BlogController;
export default function initRoutes(app: Express) {
    blogController = new BlogController(app);
}