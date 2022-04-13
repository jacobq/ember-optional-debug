import { getLoggingFunctions } from 'ember-optional-debug/utils/log';
//import { apply, diff, diffSummary, newEmberApp } from 'ember-apply/test-utils';
import { describe, expect, it } from 'vitest';
//import { default as embroider } from './index';

describe('getLoggingFunctions', () => {
  it('getLoggingFunctions export exists', () => {
    expect(typeof getLoggingFunctions).toEqual('function');
  });
});
