//Automatically generated service.

import { Client } from '../client/Utils/lib/Client';
import { CategoryService } from './clientServices/CategoryService';
import { BlogService } from './clientServices/BlogService';
export namespace Services {
    export const category = new CategoryService();
    export const blog = new BlogService();
} // export namespace Services 

export function setClientForAllServices(client: Client) {
    Services.category.setClient(client);
    Services.blog.setClient(client);
}

