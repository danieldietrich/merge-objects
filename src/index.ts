/**
 * Merges multiple objects into a new object.
 *
 * @param objects a sequence of objects
 * @returns a new object
 */
export = function mergeObjects<T1, T2, T3, T4>(t1?: T1, t2?: T2, t3?: T3, t4?: T4): {} & T1 & T2 & T3 & T4 {

    return ([t1, t2, t3, t4]
        .filter(t => isObject(t)) as Obj[])
        .reduce(merge, {}) as {} & T1 & T2 & T3 & T4;

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
