export interface Client {
    get<ResponseTypeType>(action: string): Promise<ResponseTypeType>;
    put<ResponseType>(action: string, data: any): Promise<ResponseType>;
    post<ResponseType>(action: string, data: any): Promise<ResponseType>;
    delete<ResponseType>(action: string): Promise<ResponseType>;
}