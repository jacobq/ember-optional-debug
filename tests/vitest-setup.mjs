import path from 'path';
import { existsSync, readFileSync } from 'fs';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// We need to load the `ember build` stuff to get modules resolvable
const distPath = path.join(__dirname, '..', 'dist');
if (!existsSync(distPath)) {
  throw Error(
    `dist folder (${distPath}) not found\nYou probably need to run 'ember build'`
  );
}

// Since we're running in node and not in a browser we need to do a
// little tweaking to make things "work" (e.g. <meta> tag with config)
// Note: JSDOM will note execute the scripts here like vendor.js & dummy.js
import { JSDOM } from 'jsdom';
const { window } = new JSDOM(readFileSync(path.join(distPath, 'index.html')));
globalThis.document = window.document;
globalThis.self = window;
globalThis.window = window;

// (testing JSDOM)
//const config = JSON.parse(decodeURIComponent(document.querySelector('meta[name="dummy/config/environment"]').getAttribute('content')));
//console.log(config);

// Browsers don't usually have a built-in `require` function,
// so from here on we rename node's CJS require function as "requireNode"
// to avoid accidentally calling it when we would be calling the
// AMD loader's require (from webpack/requirejs/whatever).
// (NOT A PROBLEM IN ESM :D)
//globalThis.requireNode = require;
//delete globalThis.require;

// If we were to use Node's `require` to run our app's compiled output scripts
// (vendor.js & dummy.js) things break because each call gets wrapped in module scope.
// Hence we attempt something a bit scary here: evaluate them directly in this context.
try {
  const bigNastyScript = `
(function() {
  //console.log('this === globalThis', this === globalThis); // true!
  //var exports = globalThis;
  //var module = { exports };

${readFileSync(path.join(distPath, 'assets', 'vendor.js'), 'utf-8')
    .replace(';self.EmberENV.EXTEND_PROTOTYPES = false;',
    ';self.EmberENV.EXTEND_PROTOTYPES = false;\n' +
    'globalThis.define = define;\n' +
    'globalThis.require = require;\n'
    )}

  console.log('end of normal vendor.js');

  // In a browser, script global vars evidently get set on globalThis
  // but not in node :/ so we need to do this to ensure that the ember app
  // doesn't lose all the modules defined by vendor.js
  globalThis.define = define;
  globalThis.require = require;
  globalThis.runningTests = runningTests;
}).call(globalThis);
console.log('end of wrapped vendor.js');

${readFileSync(path.join(distPath, 'assets', 'test-support.js'), 'utf-8')}
console.log('loaded test-support.js');

${readFileSync(path.join(distPath, 'assets', 'dummy.js'), 'utf-8')}
console.log('finished dummy.js');
`;
  eval(bigNastyScript);
  console.log('TODO: now you can run your tests & stuff...');
} catch(e) {
  console.error(e);
}

