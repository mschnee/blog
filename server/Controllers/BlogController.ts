import { Request, Response } from 'express';
import { IBlogController, BlogController as GeneratedBlogController } from '../../generated/services/BlogController';

export class BlogController extends GeneratedBlogController implements IBlogController {
    public get(request: Request, response: Response, postId?: string) {
        response.end('ok');
    }
} 