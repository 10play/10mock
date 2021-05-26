export type Method =
  | "all"
  | "get"
  | "post"
  | "put"
  | "delete"
  | "patch"
  | "options"
  | "head";

export interface AddRouteBody {
  method: Method;
  path: string;
  response: {
    body: any;
    status: number;
  };
}

export interface Route {
  method?: Method;
  path?: string;
  response?: Response;
}
export interface Response {
  body?: any;
  status: number;
}
