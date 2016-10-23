import { Store } from './Store';
import { Blog } from '../../generated/types';
import { services } from '../globals';

export class BlogStore extends Store {
    getBlogs(tag: string): Promise<Blog.Post[]> {
        return services.blog.getByTag(tag).then(r => {
            
        });
    }
}