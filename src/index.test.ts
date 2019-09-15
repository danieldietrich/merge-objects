import mergeObjects from '.';

test('Should merge zero objects', () => {
    expect(mergeObjects()).toEqual({});
});

test('Should merge undefined', () => {
    expect(mergeObjects(undefined)).toEqual({});
});

test('Should merge distinct objects recursively', () => {
    expect(mergeObjects(
        {a: {b: 1, c: [1], d: 3}},
        {a: {b: 2, c: [2]}},
        {a: {b: undefined, e: 4}},
    )).toEqual({a: {b: 2, c: [1, 2], d: 3, e: 4}});
});

test('Should merge 8 objects', () => {
    expect(
        mergeObjects({a1: 1}, {a2: 2}, {a3: 3}, {a4: 4}, {b1: 1}, {b2: 2}, {b3: 3}, {b4: 4}),
    ).toEqual({a1: 1, a2: 2, a3: 3, a4: 4, b1: 1, b2: 2, b3: 3, b4: 4});
});

test('Should coerce key type string when key is number', () => {
    expect(mergeObjects({1: "a"})).toEqual({1: "a"});
});

test('Should allow function properties', () => {
    const f = () => {};
    expect(mergeObjects({f})).toEqual({f});
});

test('Should remove undefined properties', () => {
    expect(mergeObjects(
        {a: undefined, b: [1, undefined, 2], c: {d: undefined}},
    )).toEqual({b: [1, undefined, 2], c: {}});
});

test('Should overwrite with null', () => {
    expect(mergeObjects({a: 1}, {a: null})).toEqual({a: null});
});

test('Should merge null and undefined objects', () => {
    expect(mergeObjects(
        {a: 1}, undefined, {b: 2},
    )).toEqual({a: 1, b: 2});
});

test('Should not merge duplicate property with undefined value', () => {
    expect(mergeObjects({a: 1}, {a: undefined}, {c: 3})).toEqual({a: 1, c: 3});
});

test('Should not merge non-existing property with undefined value', () => {
    expect(mergeObjects({a: 1}, {b: undefined}, {c: 3})).toEqual({a: 1, c: 3});
});

test('Should overwrite existing property if values have same type', () => {
    expect(mergeObjects({a: 1}, {a: 2}, {c: 3})).toEqual({a: 2, c: 3});
});

test('Should concatenate arrays', () => {
    expect(mergeObjects({a: [1]}, {a: [2]}, {c: 3})).toEqual({a: [1, 2], c: 3});
});

test('Should not merge objects within arrays', () => {
    expect(mergeObjects({0: [{a: 1}]}, {0: [{a: 2}]}, {c: 3})).toEqual({0: [{a: 1}, {a: 2}], c: 3});
});

test('Should overwrite existing property if source is array and target is object', () => {
    expect(mergeObjects({a: {0: '0'}}, {a: [2]}, {c: 3})).toEqual({a: [2], c: 3});
});

test('Should overwrite existing property if source is object and target is array', () => {
    expect(mergeObjects({a: [2]}, {a: {0: '0'}}, {c: 3})).toEqual({a: {0: '0'}, c: 3});
});

test('Should overwrite existing property if source is null and target is object', () => {
    expect(mergeObjects({a: {0: '0'}}, {a: null}, {c: 3})).toEqual({a: null, c: 3});
});

test('Should overwrite existing property if source is object and target is null', () => {
    expect(mergeObjects({a: null}, {a: {0: '0'}}, {c: 3})).toEqual({a: {0: '0'}, c: 3});
});

test('Should overwrite existing property if source is array and target is null', () => {
    expect(mergeObjects({a: null}, {a: [2]}, {c: 3})).toEqual({a: [2], c: 3});
});

test('Should overwrite existing property if source is null and target is array', () => {
    expect(mergeObjects({a: [2]}, {a: null}, {c: 3})).toEqual({a: null, c: 3});
});

test('Should infer {} with zero arguments', () => {
    const o: {} = mergeObjects();
    expect(typeof o).toBe("object");
});

test('Should infer intersection of arguments', () => {
    type T = {a?: string, b: number};
    type U = {c?: string, d: number};
    function f(t?: T, u?: U) {
        const o = mergeObjects({a: "A"}, t, u);
        const a: string = o.a;
        const b: number = o.b;
        const c: string | undefined = o.c;
        const d: number = o.d;
        expect(a + b + c + d).toBe("Aundefinedundefinedundefined");
    }
    f();
});
