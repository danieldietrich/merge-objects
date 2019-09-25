[![npm version](https://img.shields.io/npm/v/@danieldietrich/merge-objects?logo=npm&style=flat-square)](https://www.npmjs.com/package/@danieldietrich/merge-objects/)[![vulnerabilities](https://img.shields.io/snyk/vulnerabilities/npm/@danieldietrich/merge-objects?style=flat-square)](https://snyk.io/test/npm/@danieldietrich/merge-objects)[![minzipped size](https://img.shields.io/bundlephobia/minzip/@danieldietrich/merge-objects?style=flat-square)](https://bundlephobia.com/result?p=@danieldietrich/merge-objects@latest)
&nbsp;
[![build](https://img.shields.io/travis/danieldietrich/merge-objects?logo=github&style=flat-square)](https://travis-ci.org/danieldietrich/merge-objects/)[![coverage](https://img.shields.io/codecov/c/github/danieldietrich/merge-objects?style=flat-square)](https://codecov.io/gh/danieldietrich/merge-objects/)
&nbsp;
![Platform](https://img.shields.io/badge/platform-Node%20v10%20+%20Browser%20%28ES6%2fES2015%29-decc47?logo=TypeScript&style=flat-square)
&nbsp;
[![donate](https://img.shields.io/badge/Donate-PayPal-blue.svg?logo=paypal&style=flat-square)](https://paypal.me/danieldietrich13)[![patrons](https://img.shields.io/liberapay/patrons/danieldietrich?style=flat-square)](https://liberapay.com/danieldietrich/)[![license](https://img.shields.io/github/license/danieldietrich/merge-objects?style=flat-square)](https://opensource.org/licenses/MIT/)
&nbsp;
[![Follow](https://img.shields.io/twitter/follow/danieldietrich?label=Follow&style=social)](https://twitter.com/danieldietrich/)

# merge-objects

Merges multiple objects into a new object.

Compared to _Object.assign()_ or object spreads _{...obj1, ...obj2}_, values are not assigned as a whole. Instead, properties that don't hold the value _undefined_ are recursively merged. The difference to Lodash's __.merge_ or jQuery's _deep extend_ is that arrays are concatenated.

Features:

* Type-safe: computes intersection of input arguments
* Fail-safe: allows any input type but only merges objects
* Immutable: creates a new object instead of assigning to the first argument
* Concatenates arrays []
* Recursively merges objects {}
* Skips undefined properties
* Overwrites properties if value is not undefined
* Merges up to 4 objects, composes for more.

## Installation

```bash
npm i @danieldietrich/merge-objects
```

## Usage

The module supports ES6 _import_ and CommonJS _require_ style.

```ts
import mergeObjects from '@danieldietrich/merge-objects';

// -- merge n objects
// = {a: {b: 2, c: [1, 2], d: 3, e: 4}}
mergeObjects(
    {a: {b: 1, c: [1], d: 3}},
    {a: {b: 2, c: [2]}},
    {} || undefined,
    {a: {b: undefined, e: 4}}
);

// -- remove undefined properties
// = {b: [1, undefined, 2], c: {}}
mergeObjects(
    {a: undefined, b: [1, undefined, 2], c: {d: undefined}}
);
```

## Type safety

While merge-objects works well with JavaScript, it comes with TypeScript types. The merged object type is inferred by the TypeScript compiler:

```ts
/*
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
}
*/
const o = mergeObjects(
    {0: 1, a: 1,   b: [1], c: [1],   f: () => {}},
    {0: 2, a: "2", b: [2], c: ["2"], f: (arg: number) => true},
    {} || undefined,
);
```

✅ When objects have similar field types we walk on the sunny path. The compiler infers the union type of the input arguments. The merge result is the intersection of non-nullable input types. This is exactly the way _Object.assign()_ works, see type definitions in [lib.es2015.core.d.ts](https://github.com/microsoft/TypeScript/blob/b963e1a2a7e3b1056ee2552927fa08fcc51e4c7d/lib/lib.es2015.core.d.ts#L305).

```ts
// const first: number
const first = o[0];

// const b: number[]
const b = o.b;

// compiler error "Property 'x' does not exist on type '...'."
const x = o.x;
```

✴️ If object fields have orthogonal types, the intersection type results in the type _never_. Functions are an exception, here we get different overloads. However, these might not reflect the actual field type at runtime.

```ts
// computed type: string & number, eff. never;
// actual type: string
const a = o.a;

// computed type: number[] & string[], eff. never[]
// actual type: Array<number | string>
const c = o.c;

// computed type: (() => void) & ((arg: number) => true)
// actual type: ((arg: number) => true)
const f = o.f;
```

Bottom line: thou shalt not merge incompatible objects.

---

Copyright &copy; 2019 by [Daniel Dietrich](cafebab3@gmail.com). Released under the [MIT](https://opensource.org/licenses/MIT/) license.