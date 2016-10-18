import { Request, Response } from 'express';
import { IBlogController, BlogController as GeneratedBlogController } from '../../generated/services/BlogController';

import { Blog } from '../../generated/types';

export class BlogController extends GeneratedBlogController implements IBlogController {
    public get(request: Request, response: Response, postId?: string): Blog.MultiPostResponse {
        const result: Blog.MultiPostResponse = {
            posts: []
        };
        
        return result;
    }
}
