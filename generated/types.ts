// Automatically generated.  Don't modify it!! Have fun!
export namespace Category {
    export interface Category {
        categoryId: string;
        name: string;
    } // export interface Category

    export interface CategoryResponse {
        categories: Category[];
    } // export interface CategoryResponse

    export interface PostCategoryRequest {
        name: string;
    } // export interface PostCategoryRequest

    export interface GetBlankRequest {
    } // export interface GetBlankRequest

} // namespace Category

export namespace Blog {
    export interface Post {
        postId: string;
        title: string;
        userId: string;
        content: string;
        postedOn: number;
        tags: string[];
        updatedOn?: number;
    } // export interface Post

    export interface SinglePostResponse {
        post: Post;
    } // export interface SinglePostResponse

    export interface MultiPostResponse {
        posts: Post[];
    } // export interface MultiPostResponse

    export interface GetBlankRequest {
    } // export interface GetBlankRequest

    export interface GetByIdRequest {
        postId?: string;
    } // export interface GetByIdRequest

    export interface GetByTagRequest {
        tag: string;
    } // export interface GetByTagRequest

    export interface GetByTagsRequest {
        tags: string[];
    } // export interface GetByTagsRequest

} // namespace Blog


