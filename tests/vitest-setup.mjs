import path from 'path';
import { existsSync, readFileSync } from 'fs';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import { JSDOM } from 'jsdom';

export function setup() {
  //console.log('Running setup function');
  // We need to load the `ember build` stuff to get modules resolvable
  const distPath = path.join(__dirname, '..', 'dist');
  if (!existsSync(distPath)) {
    throw Error(
      `dist folder (${distPath}) not found\nYou probably need to run 'ember build'`
    );
  }
  const [vendorJS, testSupportJS, dummyJS] = [
    'vendor.js',
    'test-support.js',
    'dummy.js',
  ].map(name => readFileSync(path.join(distPath, 'assets', name), 'utf-8'))

  // Since we're running in node and not in a browser we need to do a
  // little tweaking to make things "work" (e.g. <meta> tag with config)
  // Note: JSDOM will not execute the scripts in the HTML like vendor.js & dummy.js
  const window = new JSDOM(readFileSync(path.join(distPath, 'index.html'))).window;
  const self = window;
  const document = window.document;

  // (testing JSDOM)
  //const config = JSON.parse(decodeURIComponent(document.querySelector('meta[name="dummy/config/environment"]').getAttribute('content')));
  //console.log(config);

  // Browsers don't usually have a built-in `require` function,
  // so from here on we rename node's CJS require function as "requireNode"
  // to avoid accidentally calling it when we would be calling the
  // AMD loader's require (from webpack/requirejs/whatever).
  // (this does not apply now that we are using ESM)
  //globalThis.requireNode = require;
  //delete globalThis.require;
  let requireAMD;

  // If we were to use Node's `require` to run our app's compiled output scripts
  // (vendor.js & dummy.js) things break because each call gets wrapped in module scope.
  // Hence we attempt something a bit scary here: evaluate them directly in this context.
  eval(`
(function() {
  //console.log('eval start');
  // We use this to link the define & require functions set by the loader
  // since Node doesn't treat "globals" the same way as the browser does
  // (e.g. 'var x = ...' is different than 'globalThis.x = ...')
  // It contains code like this that we want to tap into:
  //   if (typeof exports === 'object' && typeof module === 'object' && module.exports) {
  //     module.exports = { require: require, define: define };
  //   }
  var exports = {};
  var module = { exports };
  Object.defineProperty(module, 'exports', {
    get() {
      return {};
    },
    set(value) {
      //console.log('module setter called', value);
      if (typeof value === 'object') {
        if (typeof value.define === 'function') {
          globalThis.define = value.define;
        }
        if (typeof value.require === 'function') {
          globalThis.require = value.require;
          requireAMD = value.require;
        }
      }
    }
  });

  ${vendorJS}
  //console.log('end of normal vendor.js');

  // In a browser, script global vars evidently get set on globalThis
  // but not in node :/ so we need to do this to ensure that the ember app
  // doesn't lose all the modules defined by vendor.js
  // (already set define & require above)
  globalThis.runningTests = runningTests;
}).call(window);
//}).call(globalThis);
//console.log('end of wrapped vendor.js');

${testSupportJS}
//console.log('loaded test-support.js');

${dummyJS}
//console.log('finished dummy.js');
//console.log('eval end');
  `);
  return {
    requireAMD
  }
}

export function teardown() {
  // No special tear-down needed, but vitest expects to find both functions exported
}

// Demo below "works" outside of vitest...
//globalThis.requireAMD = setup().requireAMD;
//console.log(globalThis.requireAMD);
//console.log(globalThis.requireAMD('ember-optional-debug/utils/log'));
//const { getLoggingFunctions } = globalThis.requireAMD('ember-optional-debug/utils/log');
//console.log(getLoggingFunctions);
