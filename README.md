[![npm version](https://img.shields.io/npm/v/@danieldietrich/merge-objects?logo=npm&style=flat-square)](https://www.npmjs.com/package/@danieldietrich/merge-objects/)[![vulnerabilities](https://img.shields.io/snyk/vulnerabilities/npm/@danieldietrich/merge-objects?style=flat-square)](https://snyk.io/test/npm/@danieldietrich/merge-objects)[![minzipped size](https://img.shields.io/bundlephobia/minzip/@danieldietrich/merge-objects?style=flat-square)](https://bundlephobia.com/result?p=@danieldietrich/merge-objects@latest)![types](https://img.shields.io/npm/types/typescript?style=flat-square)[![license](https://img.shields.io/github/license/danieldietrich/merge-objects?style=flat-square)](https://opensource.org/licenses/MIT/)
&nbsp;
[![build](https://img.shields.io/travis/danieldietrich/merge-objects?logo=github&style=flat-square)](https://travis-ci.org/danieldietrich/merge-objects/)[![coverage](https://img.shields.io/codecov/c/github/danieldietrich/merge-objects?style=flat-square)](https://codecov.io/gh/danieldietrich/merge-objects/)
&nbsp;
[![donate](https://img.shields.io/badge/Donate-PayPal-blue.svg?logo=paypal&style=flat-square)](https://paypal.me/danieldietrich13)[![patrons](https://img.shields.io/liberapay/patrons/danieldietrich?style=flat-square)](https://liberapay.com/danieldietrich/)
&nbsp;
[![Follow](https://img.shields.io/twitter/follow/danieldietrich?label=Follow&style=social)](https://twitter.com/danieldietrich/)

# merge-objects

Merges multiple objects into a new object.

Compared to _Object.assign()_ or _{...obj1, ...obj2}_, values are not assigned as a whole. Instead, properties that don't hold the value _undefined_ are recursively merged. The difference to Lodash's __.merge_ or jQuery's deep _extend_ is that arrays are concatenated.

## Installation

```bash
npm i @danieldietrich/merge-objects
```

## Usage

The module supports ES6 _import_ and CommonJS _require_ style.

```ts
import mergeObjects from 'merge-objects';

// {a: 1, b: 2, c: 3}
mergeObjects({a: 1}, {b: 2}, {c: 3});

// {a: {b: 3, c: 2, d: 4}}
mergeObjects(
    {a: {b: 1, c: 2}},
    {a: {b: 3, d: 4}}
);

// {a: 2}
mergeObjects({a: [1]}, {a: 2});

// {a: [1, 2]}
mergeObjects({a: [1]}, {a: [2]});
```

---

Copyright &copy; 2019 by [Daniel Dietrich](cafebab3@gmail.com). Released under the [MIT](https://opensource.org/licenses/MIT/) license.