/**
 * Merges multiple objects into a new object.
 *
 * @param objects a sequence of objects
 * @returns a new object
 */
export = function mergeObjects<T extends Array<Obj | undefined>>(...objects: T): {} & Intersection<T> {

    return objects.reduce(merge, {}) as {} & Intersection<T>;

    function merge(target: Obj, source?: Obj): Obj {
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

    function isObject(value: unknown): value is Obj {
        return value instanceof Object && value.constructor === Object;
    }
};

type Obj = Record<string | number | symbol, unknown>;

// TODO: see also https://github.com/Microsoft/TypeScript/pull/21316#issuecomment-359574388

// see https://stackoverflow.com/a/51604379/1110815
type Intersection<T extends unknown[]> = UnboxIntersection<UnionToIntersection<BoxedTupleTypes<T>>>;

// boxing/unboxing tuples helps to distinguish between single-parameters-which-are-unions and the union of multiple parameters
// and prevents union types from being turned into intersection types
type BoxedTupleTypes<T extends unknown[]> = { [P in keyof T]: [T[P]] }[Exclude<keyof T, keyof unknown[]>];
type UnionToIntersection<U> = (U extends unknown ? (k: U) => void : never) extends ((k: infer I) => void) ? I : never;
type UnboxIntersection<T> = T extends { 0: infer U } ? U : never;
