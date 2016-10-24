import { Express, Request, Response } from 'express';
import { ICategoryController } from '../../generated/services/CategoryController';

import { tags } from '../data/tags';
import { Category } from '../../generated/types';

export class CategoryController implements ICategoryController {
    get(request: Request, response: Response) {
        return {
            categories: tags.map(t => ({categoryId: t, name: t}))
        };
    }

    post(request: Request, response: Response, body: Category.PostCategoryRequest) {
        return {};
    }
}