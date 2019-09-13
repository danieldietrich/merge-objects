import mergeObjects from '.';

test('Should merge zero objects', () => {
    expect(mergeObjects()).toEqual({});
});

test('Should merge distinct objects', () => {
    expect(mergeObjects({a: 1}, {b: 2}, {c: 3})).toEqual({a: 1, b: 2, c: 3});
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
