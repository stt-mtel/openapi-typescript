import type { GlobalContext, ReferenceObject, SchemaObject } from "../types.js";
export interface TransformSchemaObjectOptions {
    path: string;
    ctx: GlobalContext;
}
export default function transformSchemaObject(schemaObject: SchemaObject | ReferenceObject, options: TransformSchemaObjectOptions): string;
export declare function defaultSchemaObjectTransform(schemaObject: SchemaObject | ReferenceObject, { path, ctx }: TransformSchemaObjectOptions): string;
