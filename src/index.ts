/**
 * Merges multiple objects into a new object.
 *
 * @param objects a sequence of objects
 * @returns a new object
 */
export = function mergeObjects<T extends Obj>(...objects: T[]): Merged<T> {

    return objects.reduce(merge, {}) as Merged<T>;

    function merge(target: Record<string, unknown>, source: Record<string, unknown> | null | undefined): Record<string, unknown> {
        if (source) {
            for (const [key, value2] of Object.entries(source)) {
                if (value2 !== undefined) {
                    const value1 = target[key];
                    if (value1 === undefined) { // redundant to last else case but may be faster
                        target[key] = value2;
                    } else if (Array.isArray(value1) && Array.isArray(value2)) {
                        target[key] = value1.concat(value2);
                    } else if (isObject(value1) && isObject(value2)) {
                        target[key] = merge(value1, value2);
                    } else {
                        target[key] = value2;
                    }
                }
            }
        }
        return target;
    }

    function isObject(value: unknown): value is Record<string, unknown> {
        return value instanceof Object && value.constructor === Object;
    }
};

// Type of input objects
type Obj = JSONObject | null | undefined;

// Output type = merged inputs
type Merged<T extends Obj> = NoUndefinedField<NonNullable<T>>;

// Removes fields with undefined values
type NoUndefinedField<T> =
    T extends JSONArray ? T :
    T extends JSONObject ? { [P in keyof T]-?: NoUndefinedField<NotUndefined<T[P]>> } :
    T;

// Does not permit undefined
type NotUndefined<T> = T extends undefined ? never : T;

// A recursive JSON definition, permitsundefined
type JSONValue =
    | string
    | number
    | boolean
    | null
    | undefined
    | JSONObject
    | JSONArray;

interface JSONObject {
    [key: string]: JSONValue;
}

interface JSONArray extends Array<JSONValue> { }
