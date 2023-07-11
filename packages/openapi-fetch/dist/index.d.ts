/** options for each client instance */
interface ClientOptions extends RequestInit {
    /** set the common root URL for all API requests */
    baseUrl?: string;
    /** custom fetch (defaults to globalThis.fetch) */
    fetch?: typeof fetch;
    /** global querySerializer */
    querySerializer?: QuerySerializer<unknown>;
    /** global bodySerializer */
    bodySerializer?: BodySerializer<unknown>;
}
export interface BaseParams {
    params?: {
        query?: Record<string, unknown>;
    };
}
export type PathItemObject = {
    [M in HttpMethod]: OperationObject;
} & {
    parameters?: any;
};
export type ParseAs = "json" | "text" | "blob" | "arrayBuffer" | "stream";
export interface OperationObject {
    parameters: any;
    requestBody: any;
    responses: any;
}
export type HttpMethod = "get" | "put" | "post" | "delete" | "options" | "head" | "patch" | "trace";
export type OkStatus = 200 | 201 | 202 | 203 | 204 | 206 | 207;
export type ErrorStatus = 500 | 400 | 401 | 402 | 403 | 404 | 405 | 406 | 407 | 408 | 409 | 410 | 411 | 412 | 413 | 414 | 415 | 416 | 417 | 418 | 420 | 421 | 422 | 423 | 424 | 425 | 426 | 429 | 431 | 444 | 450 | 451 | 497 | 498 | 499 | "default";
/** Get a union of paths which have method */
export type PathsWith<Paths extends Record<string, PathItemObject>, PathnameMethod extends HttpMethod> = {
    [Pathname in keyof Paths]: Paths[Pathname] extends {
        [K in PathnameMethod]: any;
    } ? Pathname : never;
}[keyof Paths];
/** Find first match of multiple keys */
export type FilterKeys<Obj, Matchers> = {
    [K in keyof Obj]: K extends Matchers ? Obj[K] : never;
}[keyof Obj];
export type MediaType = `${string}/${string}`;
export type Params<T> = T extends {
    parameters: any;
} ? {
    params: NonNullable<T["parameters"]>;
} : BaseParams;
export type RequestBodyObj<T> = T extends {
    requestBody?: any;
} ? T["requestBody"] : never;
export type RequestBodyContent<T> = undefined extends RequestBodyObj<T> ? FilterKeys<NonNullable<RequestBodyObj<T>>, "content"> | undefined : FilterKeys<RequestBodyObj<T>, "content">;
export type RequestBodyMedia<T> = FilterKeys<RequestBodyContent<T>, MediaType> extends never ? FilterKeys<NonNullable<RequestBodyContent<T>>, MediaType> | undefined : FilterKeys<RequestBodyContent<T>, MediaType>;
export type RequestBody<T> = undefined extends RequestBodyMedia<T> ? {
    body?: RequestBodyMedia<T>;
} : {
    body: RequestBodyMedia<T>;
};
export type QuerySerializer<T> = (query: T extends {
    parameters: any;
} ? NonNullable<T["parameters"]["query"]> : Record<string, unknown>) => string;
export type BodySerializer<T> = (body: RequestBodyMedia<T>) => any;
export type RequestOptions<T> = Params<T> & RequestBody<T> & {
    querySerializer?: QuerySerializer<T>;
    bodySerializer?: BodySerializer<T>;
    parseAs?: ParseAs;
};
export type Success<T> = FilterKeys<FilterKeys<T, OkStatus>, "content">;
export type Error<T> = FilterKeys<FilterKeys<T, ErrorStatus>, "content">;
export type FetchOptions<T> = RequestOptions<T> & Omit<RequestInit, "body">;
export type FetchResponse<T> = {
    data: T extends {
        responses: any;
    } ? NonNullable<FilterKeys<Success<T["responses"]>, MediaType>> : unknown;
    error?: never;
    response: Response;
} | {
    data?: never;
    error: T extends {
        responses: any;
    } ? NonNullable<FilterKeys<Error<T["responses"]>, MediaType>> : unknown;
    response: Response;
};
/** serialize query params to string */
export declare function defaultQuerySerializer<T = unknown>(q: T): string;
/** serialize body object to string */
export declare function defaultBodySerializer<T>(body: T): string;
/** Construct URL string from baseUrl and handle path and query params */
export declare function createFinalURL<O>(url: string, options: {
    baseUrl?: string;
    params: {
        query?: Record<string, unknown>;
        path?: Record<string, unknown>;
    };
    querySerializer: QuerySerializer<O>;
}): string;
export default function createClient<Paths extends {}>(clientOptions?: ClientOptions): {
    /** Call a GET endpoint */
    get<P extends PathsWith<Paths, "get">>(url: P, init: FetchOptions<FilterKeys<Paths[P], "get">>): Promise<FetchResponse<"get" extends infer T ? T extends "get" ? T extends keyof Paths[P] ? Paths[P][T] : unknown : never : never>>;
    /** Call a PUT endpoint */
    put<P_1 extends PathsWith<Paths, "put">>(url: P_1, init: FetchOptions<FilterKeys<Paths[P_1], "put">>): Promise<FetchResponse<"put" extends infer T_1 ? T_1 extends "put" ? T_1 extends keyof Paths[P_1] ? Paths[P_1][T_1] : unknown : never : never>>;
    /** Call a POST endpoint */
    post<P_2 extends PathsWith<Paths, "post">>(url: P_2, init: FetchOptions<FilterKeys<Paths[P_2], "post">>): Promise<FetchResponse<"post" extends infer T_2 ? T_2 extends "post" ? T_2 extends keyof Paths[P_2] ? Paths[P_2][T_2] : unknown : never : never>>;
    /** Call a DELETE endpoint */
    del<P_3 extends PathsWith<Paths, "delete">>(url: P_3, init: FetchOptions<FilterKeys<Paths[P_3], "delete">>): Promise<FetchResponse<"delete" extends infer T_3 ? T_3 extends "delete" ? T_3 extends keyof Paths[P_3] ? Paths[P_3][T_3] : unknown : never : never>>;
    /** Call a OPTIONS endpoint */
    options<P_4 extends PathsWith<Paths, "options">>(url: P_4, init: FetchOptions<FilterKeys<Paths[P_4], "options">>): Promise<FetchResponse<"options" extends infer T_4 ? T_4 extends "options" ? T_4 extends keyof Paths[P_4] ? Paths[P_4][T_4] : unknown : never : never>>;
    /** Call a HEAD endpoint */
    head<P_5 extends PathsWith<Paths, "head">>(url: P_5, init: FetchOptions<FilterKeys<Paths[P_5], "head">>): Promise<FetchResponse<"head" extends infer T_5 ? T_5 extends "head" ? T_5 extends keyof Paths[P_5] ? Paths[P_5][T_5] : unknown : never : never>>;
    /** Call a PATCH endpoint */
    patch<P_6 extends PathsWith<Paths, "patch">>(url: P_6, init: FetchOptions<FilterKeys<Paths[P_6], "patch">>): Promise<FetchResponse<"patch" extends infer T_6 ? T_6 extends "patch" ? T_6 extends keyof Paths[P_6] ? Paths[P_6][T_6] : unknown : never : never>>;
    /** Call a TRACE endpoint */
    trace<P_7 extends PathsWith<Paths, "trace">>(url: P_7, init: FetchOptions<FilterKeys<Paths[P_7], "trace">>): Promise<FetchResponse<"trace" extends infer T_7 ? T_7 extends "trace" ? T_7 extends keyof Paths[P_7] ? Paths[P_7][T_7] : unknown : never : never>>;
};
export {};
