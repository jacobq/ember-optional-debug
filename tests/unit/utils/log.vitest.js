import { describe, expect, it } from 'vitest';

// Since the code under test has already been "compiled" we have to
// load it via AMD/require instead of the usual import syntax.
// That is, we can't simply do this:
//   import { getLoggingFunctions } from 'ember-optional-debug/utils/log';
import * as EmberCodeLoader from '../../vitest-setup.mjs';
const setupEmberStuff = EmberCodeLoader.setup;
//console.log('setupEmberStuff', setupEmberStuff.toString());

describe('getLoggingFunctions', () => {
  debugger; // TODO: Figure out how to attach a debugger to isolated instance
  return; // FIXME: without this we get a segmentation fault from vitest at the next line
  const { requireAMD } = setupEmberStuff();
  const { getLoggingFunctions } = requireAMD('ember-optional-debug/utils/log');
  console.log(getLoggingFunctions);
  it('getLoggingFunctions export exists', () => {
    expect(typeof getLoggingFunctions).toEqual('function');
  });

  //it('logs through debug module', async () => {
  //  throw Error('Test not implemented');
  //});
});
