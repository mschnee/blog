import { Request, Response } from 'express';
import { BlogController as GeneratedBlogController } from '../../generated/services/BlogController';

export class BlogController extends GeneratedBlogController {
    public get(request: Request, response: Response, postId?: string) {
        response.end('ok');
    }
} 