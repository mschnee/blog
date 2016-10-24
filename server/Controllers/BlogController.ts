import { Request, Response } from 'express';
import { IBlogController } from '../../generated/services/BlogController';

import { Blog } from '../../generated/types';

import { posts } from '../data/blogPosts';
import { tags } from '../data/tags';

export class BlogController implements IBlogController {
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
        tag = tag.toLowerCase();
        if (tags.indexOf(tag) < 0) {
            response.status(404);
            return {
                posts: []
            };
        }

        const results = posts.filter(f => f.tags.indexOf(tag) >= 0);

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

    public getByTags(request: Request, response: Response, requestTags: string[]): Blog.MultiPostResponse {
        if (!requestTags || !requestTags.length) {
            response.status(404);
            return {
                posts: []
            };
        }
        const filters = requestTags.filter(t => tags.indexOf(t) >= 0).map(String.prototype.toLowerCase);

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
