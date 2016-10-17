export interface Client {
    get<ResponseType>(action: string): Promise<ResponseType>;
    put<ResponseType>(action: string, data: any): Promise<ResponseType>;
    post<ResponseType>(action: string, data: any): Promise<ResponseType>;
    delete<ResponseType>(action: string): Promise<ResponseType>;
}