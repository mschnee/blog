import { ServiceClient } from '../../client/Utils/lib/ServiceClient';

import { Category } from '../types';

import GetBlankRequest = Category.GetBlankRequest;
import CategoryResponse = Category.CategoryResponse;
import PostCategoryRequest = Category.PostCategoryRequest;

export class CategoryService extends ServiceClient {
    get() {
        return this.client.get<CategoryResponse>(`/api/category/get/`);
    }
    post(request: PostCategoryRequest) {
        return this.client.post<GetBlankRequest>('/api/category/post', request);
    }
}

