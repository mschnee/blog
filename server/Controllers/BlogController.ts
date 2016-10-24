import { Request, Response } from 'express';
import { IBlogController, BlogController as GeneratedBlogController } from '../../generated/services/BlogController';

import { Blog } from '../../generated/types';

import { posts } from '../data/blogPosts';
import { tags } from '../data/tags';

export class BlogController extends GeneratedBlogController implements IBlogController {
    private getFirst() {
        return {
            posts: posts.sort((l, r) => l.postedOn - r.postedOn).slice(0, 1)
        };
    }

    public get(request: Request, response: Response, postId?: string): Blog.MultiPostResponse {
        if (postId) {
            return {
                posts: posts.filter(p => p.postId === postId)
            };
        } else {
            return this.getFirst();
        }
    }

    public getByTag(request: Request, response: Response, tag: string): Blog.MultiPostResponse { 
        if (tags.indexOf(tag.toLowerCase()) < 0) {
            response.status(404);
            return {
                posts: []
            };
        }
    }

    public getByTags(request: Request, response: Response, requestTags: string[]): Blog.MultiPostResponse {
        const filters = requestTags.filter(t => tags.indexOf(t) >= 0);
        
        // none of the filters match?
        if (!filters || !filters.length) {
            response.status(404);
            return {
                posts: []
            };
        }

        const results = posts.filter(f => f.tags.some(t => filters.indexOf(t) >= 0));

        if (!results || !results.length) {
            response.status(404);
            return {
                posts: []
            };
        }

        return {
            posts: results
        };
    }
}
