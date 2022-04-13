// We need to load the `ember build` stuff to get modules resolvable

// Since we're running in node and not in a browser we need to do a little tweaking
require('node-window-polyfill').register(); // sets up globalThis.window
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

require(setupScript); // Error: Could not find module `@ember/application` imported from `dummy/app`
