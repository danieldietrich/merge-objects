import mergeObjects from '.';

test('Should merge zero objects', () => {
    const o: never = mergeObjects();
    expect(o).toEqual({});
});

test('Should merge undefined', () => {
    const o: never = mergeObjects(undefined);
    expect(o).toEqual({});
});

test('Should merge 8 objects', () => {
    const o: {
        a1: number;
    } & {
        a2: number;
    } & {
        a3: number;
    } & {
        a4: number;
    } & {
        b1: number;
    } & {
        b2: number;
    } & {
        b3: number;
    } & {
        b4: number;
    } = mergeObjects({a1: 1}, {a2: 2}, {a3: 3}, {a4: 4}, {b1: 1}, {b2: 2}, {b3: 3}, {b4: 4});
    expect(o).toEqual({a1: 1, a2: 2, a3: 3, a4: 4, b1: 1, b2: 2, b3: 3, b4: 4});
});

test('Should coerce key type string when key is number', () => {
    const o: {
        1: string;
    } = mergeObjects({1: "a"});
    expect(o).toEqual({1: "a"});
});

test('Should allow function properties', () => {
    const f = () => {};
    const o: {
        f: () => void;
    } = mergeObjects({f});
    expect(o).toEqual({f});
});

test('Should remove undefined properties', () => {
    const o: {
        a: undefined;
        b: Array<number | undefined>;
        c: {
            d: undefined;
        };
    } = mergeObjects(
        {a: undefined, b: [1, undefined, 2], c: {d: undefined}},
    );
    expect(o).toEqual({b: [1, undefined, 2], c: {}});
});

test('Should overwrite with null', () => {
    const o: {
        a: number;
    } & {
        a: null;
    } = mergeObjects({a: 1}, {a: null});
    expect(o).toEqual({a: null});
});

test('Should merge null and undefined objects', () => {
    const o: never = mergeObjects(
        {a: 1}, undefined, {b: 2},
    );
    expect(o).toEqual({a: 1, b: 2});
});

test('Should not merge duplicate property with undefined value', () => {
    const o: {
        a: number;
    } & {
        a: undefined;
    } & {
        c: number;
    } = mergeObjects({a: 1}, {a: undefined}, {c: 3});
    expect(o).toEqual({a: 1, c: 3});
});

test('Should not merge non-existing property with undefined value', () => {
    const o: {
        a: number;
    } & {
        b: undefined;
    } & {
        c: number;
    } = mergeObjects({a: 1}, {b: undefined}, {c: 3});
    expect(o).toEqual({a: 1, c: 3});
});

test('Should overwrite existing property if values have same type', () => {
    const o: {
        a: number;
    } & {
        a: number;
    } & {
        c: number;
    } = mergeObjects({a: 1}, {a: 2}, {c: 3});
    expect(o).toEqual({a: 2, c: 3});
});

test('Should concatenate arrays', () => {
    const o: {
        a: number[];
    } & {
        a: number[];
    } & {
        c: number;
    } = mergeObjects({a: [1]}, {a: [2]}, {c: 3});
    expect(o).toEqual({a: [1, 2], c: 3});
});

test('Should not merge objects within arrays', () => {
    const o: {
        0: Array<{a: number}>,
    } & {
        0: Array<{a: number}>,
    } & {
        c: number;
    } = mergeObjects({0: [{a: 1}]}, {0: [{a: 2}]}, {c: 3});
    expect(o).toEqual({0: [{a: 1}, {a: 2}], c: 3});
});

test('Should overwrite existing property if source is array and target is object', () => {
    const o: {
        a: {
            0: string;
        };
    } & {
        a: number[];
    } & {
        c: number;
    } = mergeObjects({a: {0: '0'}}, {a: [2]}, {c: 3});
    expect(o).toEqual({a: [2], c: 3});
});

test('Should overwrite existing property if source is object and target is array', () => {
    const o: {
        a: number[];
    } & {
        a: {
            0: string;
        };
    } & {
        c: number;
    } = mergeObjects({a: [2]}, {a: {0: '0'}}, {c: 3});
    expect(o).toEqual({a: {0: '0'}, c: 3});
});

test('Should overwrite existing property if source is null and target is object', () => {
    const o: {
        a: {
            0: string;
        };
    } & {
        a: null;
    } & {
        c: number;
    } = mergeObjects({a: {0: '0'}}, {a: null}, {c: 3});
    expect(o).toEqual({a: null, c: 3});
});

test('Should overwrite existing property if source is object and target is null', () => {
    const o: {
        a: null;
    } & {
        a: {
            0: string;
        };
    } & {
        c: number;
    } = mergeObjects({a: null}, {a: {0: '0'}}, {c: 3});
    expect(o).toEqual({a: {0: '0'}, c: 3});
});

test('Should overwrite existing property if source is array and target is null', () => {
    const o: {
        a: null;
    } & {
        a: number[];
    } & {
        c: number;
    } = mergeObjects({a: null}, {a: [2]}, {c: 3});
    expect(o).toEqual({a: [2], c: 3});
});

test('Should overwrite existing property if source is null and target is array', () => {
    const o: {
        a: number[];
    } & {
        a: null;
    } & {
        c: number;
    } = mergeObjects({a: [2]}, {a: null}, {c: 3});
    expect(o).toEqual({a: null, c: 3});
});

test('Should infer {} with zero arguments', () => {
    const o: {} = mergeObjects();
    expect(typeof o).toBe("object");
});

test('Should infer intersection of arguments', () => {
    type T = {a?: string, b: number};
    type U = {c?: string, d: number};
    function f(t?: T, u?: U) {
        // type is the same as typeof Object.assign({a: "A"}, t, u)
        const o: {a: string} & T & U = mergeObjects({a: "A"}, t, u);
        const a: string = o.a;
        const b: number = o.b;
        const c: string | undefined = o.c;
        const d: number = o.d;
        expect(a + b + c + d).toBe("Aundefinedundefinedundefined");
    }
    f();
});

test('Should merge complex README.md example', () => {
    const o: {
        a: {
            b: number;
            c: number[];
            d: number;
        };
    } & {
        a: {
            b: number;
            c: number[];
        };
    } & {
        a: {
            b: undefined;
            e: number;
        };
    } = mergeObjects(
        {a: {b: 1, c: [1], d: 3}},
        {a: {b: 2, c: [2]}},
        {} || undefined,
        {a: {b: undefined, e: 4}},
    );
    expect(o).toEqual({a: {b: 2, c: [1, 2], d: 3, e: 4}});
});

test('Should merge type-safety README.md example', () => {
    const f: (arg: number) => true = () => true;
    const o: {
        0: number;
        a: number;
        b: number[];
        c: number[];
        f: () => void;
    } & {
        0: number;
        a: string;
        b: number[];
        c: string[];
        f: (arg: number) => true;
    } = mergeObjects(
        {0: 1, a: 1,   b: [1], c: [1],   f: () => {}},
        {0: 2, a: "2", b: [2], c: ["2"], f},
        {} || undefined,
    );
    expect(o).toEqual({0: 2, a: "2", b: [1, 2], c: [1, "2"], f});
});
