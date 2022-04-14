const path = require('path');
const { existsSync, readFileSync, writeFileSync } = require('fs');

// We need to load the `ember build` stuff to get modules resolvable
const distPath = path.join(__dirname, '..', 'dist');
if (!existsSync(distPath)) {
  throw Error(`dist folder (${distPath}) not found\nYou probably need to run 'ember build'`);
}

// Since we're running in node and not in a browser we need to do a little tweaking
// to make things "work"
const { JSDOM } = require('jsdom');
const { window } = new JSDOM(readFileSync(path.join(distPath, 'index.html')));
globalThis.document = window.document;
globalThis.self = window;
globalThis.window = window;

// vendor.js is supposed to define a "global" `define`, but it's left in a
// top-level variable that goes out of scope when require finishes :/
// So instead we do a little hack here and concatenate the scripts that would
// normally run (in the same scope) when the browser loads the page.
// Also, from here on we rename node's "require" function as "requireNode"
// to avoid accidentally calling it when we would be calling Ember/requirejs' require.
globalThis.requireNode = require;
delete globalThis.require;

const setupScript = `${distPath}/vitest-prep.js`;
const dataToConcatenate = [
  readFileSync(path.join(distPath, 'assets', 'vendor.js'), 'utf-8'),
  `
console.log('Finished vendor.js');
// Save scoped require on global object
//globalThis.requireAMD = require;
globalThis.require = require;
  `,
  //readFileSync(path.join(distPath, 'assets', 'chunk.app.69a1b79d38ce9cadea7d.js'), 'utf-8'), // FIXME: fingerprint
  //`console.log('Finished chunk.app.js');\n`,
  readFileSync(path.join(distPath, 'assets', 'test-support.js'), 'utf-8'),
  `console.log('Finished test-support.js');\n`,
  readFileSync(path.join(distPath, 'assets', 'dummy.js'), 'utf-8'),
  `console.log('Finished dummy.js');\n`,
];
console.log(`Concatenating scripts into ${setupScript}`);
writeFileSync(
  setupScript,
  dataToConcatenate.join('\r\n')
); // (I suspect this will break source mapping)

requireNode(setupScript);
