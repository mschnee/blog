import { ServiceClient } from '../../client/Utils/lib/ServiceClient';

import { Blog } from '../types';

import GetByIdRequest = Blog.GetByIdRequest;
import MultiPostResponse = Blog.MultiPostResponse;
import GetByTagRequest = Blog.GetByTagRequest;
import GetByTagsRequest = Blog.GetByTagsRequest;

export class BlogService extends ServiceClient {
    get(postId?: string) {
        return this.client.get<MultiPostResponse>(`/api/blog/get/${postId}`);
    }
    getByTag(tag: string) {
        return this.client.get<MultiPostResponse>(`/api/blog/getByTag/${tag}`);
    }
    getByTags(tags: string[]) {
        const apiParams = encodeURIComponent(JSON.stringify({tags}));
        return this.client.get<MultiPostResponse>(`/api/blog/getByTags/?${apiParams}`);
    }
}

