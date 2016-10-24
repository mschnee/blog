import { Express, Request, Response } from 'express';
import { Controller } from '../../server/lib/Controller';

import { Blog } from '../types';

import GetByIdRequest = Blog.GetByIdRequest;
import MultiPostResponse = Blog.MultiPostResponse;
import GetByTagRequest = Blog.GetByTagRequest;
import GetByTagsRequest = Blog.GetByTagsRequest;

export interface IBlogController {
    get(request: Request, response: Response, postId?: string): MultiPostResponse;
    getByTag(request: Request, response: Response, tag: string): MultiPostResponse;
    getByTags(request: Request, response: Response, tags: string[]): MultiPostResponse;
} // export interface IBlogController

export class BlogController extends Controller implements IBlogController {
    constructor(app: Express) {
        super(app);
        this.app.get('/api/blog/get/:postId', (request, response) => {
            const result = this.get(request, response, request.params.postId);
            response.json(result);
        });
        this.app.get('/api/blog/getByTag/:tag', (request, response) => {
            const result = this.getByTag(request, response, request.params.tag);
            response.json(result);
        });
        this.app.get('/api/blog/getByTags', (request, response) => {
            const result = this.getByTags(request, response, request.params.tags);
            response.json(result);
        });
    }

    public get(request: Request, response: Response, postId?: string): MultiPostResponse { throw new Error('Not implemented'); }
    public getByTag(request: Request, response: Response, tag: string): MultiPostResponse { throw new Error('Not implemented'); }
    public getByTags(request: Request, response: Response, tags: string[]): MultiPostResponse { throw new Error('Not implemented'); }
}

