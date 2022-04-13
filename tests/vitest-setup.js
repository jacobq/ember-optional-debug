// We need to load the `ember build` stuff to get modules resolvable

// Since we're running in node and not in a browser we need to do a little tweaking
globalThis.window = require('node-window-polyfill');
globalThis.self = globalThis.window;

// vendor.js is supposed to define a global `define`, but it's left in a
// "global" that goes out of scope when require finishes :/
//require('../dist/assets/vendor.js');
//console.log(`globalObj.define -->`, globalThis.define); // undefined
//require('../dist/assets/dummy.js'); // ReferenceError: define is not defined
// So instead we do a little hack here and append a line to save it on globalThis at the end:

//import { readFileSync, writeFileSync } from 'fs'; // Doesn't work because we're outside a module
const { readFileSync, writeFileSync } = require('fs');
const distPath = `${__dirname}/../dist`;
const setupScript = `${distPath}/vitest-prep.js`;
writeFileSync(setupScript, [
  readFileSync(`${distPath}/assets/vendor.js`, 'utf-8'),
  readFileSync(`${distPath}/assets/dummy.js`, 'utf-8'),
  //readFileSync(`${distPath}/assets/test-support.js`, 'utf-8'),
].join('\r\n')); // sadly this obviously breaks source mapping...

// (first time around I tried appending this little script, but that didn't quite work right)
/*
const extraThings = `
// APPENDED
//globalThis.loader = loader;
globalThis.define = define;
globalThis.require = require;
//globalThis.requirejs = requirejs;
//globalThis.requireModule = requireModule;
globalThis.runningTests = runningTests;
`;
//console.log(`globalObj.define -->`, globalThis.define); // [Function: define] { ... }, yay!
//console.log(`globalObj.runningTests -->`, globalThis.runningTests); // false
//require(`${distPath}/assets/tests.js`); // defines `dummy/app` but "require"
//require(`${distPath}/assets/test-support.ts`);
//require(`${distPath}/assets/dummy.js`); // Error: Cannot find module 'dummy/tests/test-helper`, but that's defined in here, no?
*/

require(setupScript); // Error: Could not find module `@ember/application` imported from `dummy/app`
