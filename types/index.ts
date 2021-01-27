export type Method = 'all' | 'get' | 'post' | 'put' | 'delete' | 'patch' | 'options' | 'head'

export interface AddRouteBody {
    method: Method;
    path: string;
    response: {
        body: any;
        status: number;
    };
}
