//Automatically generated service.

import { Client } from '../client/Utils/lib/Client';
import { BlogService } from './clientServices/BlogService';
import { CategoryService } from './clientServices/CategoryService';
export namespace Services {
    export const blog = new BlogService();
    export const category = new CategoryService();
} // export namespace Services 

export function setClientForAllServices(client: Client) {
    Services.blog.setClient(client);
    Services.category.setClient(client);
}

