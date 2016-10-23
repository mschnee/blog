import { Request, Response } from 'express';
import { IBlogController, BlogController as GeneratedBlogController } from '../../generated/services/BlogController';

import { Blog } from '../../generated/types';
const testPost: Blog.Post = {
    postId: 'asdf',
    title: 'So I was thining',
    userId: '0000',
    content: 'Some kind of lorem-ipsum, right?',
    postedOn: 0,
    tags: ['about'],
}

export class BlogController extends GeneratedBlogController implements IBlogController {
    public get(request: Request, response: Response, postId?: string): Blog.MultiPostResponse {
        const result: Blog.MultiPostResponse = {
            posts: [testPost]
        };
        
        return result;
    }
}
