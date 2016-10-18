import { Request, Response } from 'express';
import { BlogController } from '../../generated/services/BlogController';

export class BlogControllerImpl extends BlogController {
    public get(request: Request, response: Response, postId?: string) {
        response.end('ok');
    }
} 