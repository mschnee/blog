import { Express, Request, Response } from 'express';
import { Controller } from '../../server/lib/Controller';

import { Category } from '../types';

import GetBlankRequest = Category.GetBlankRequest;
import CategoryResponse = Category.CategoryResponse;
import PostCategoryRequest = Category.PostCategoryRequest;

export interface ICategoryController {
    get(request: Request, response: Response): CategoryResponse;
    post(request: Request, response: Response, body: PostCategoryRequest): GetBlankRequest;
} // export interface ICategoryController

export class CategoryController extends Controller implements ICategoryController {
    constructor(app: Express) {
        super(app);
        this.app.get('/api/category/get', (request, response) => {
            const result = this.get(request, response);
            response.json(result);
        });
        this.app.post('/api/category/post', (request, response) => {
            const result = this.post(request, response, JSON.parse(request.body));
            response.json(result);
        });
    }

    public get(request: Request, response: Response): CategoryResponse { throw new Error('Not implemented'); }
    public post(request: Request, response: Response, body: PostCategoryRequest): GetBlankRequest { throw new Error('Not implemented'); }
}

