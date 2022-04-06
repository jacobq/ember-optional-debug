ember-optional-debug
==============================================================================

Provides a convenience factory utility for
[`https://github.com/debug-js/debug`](https://github.com/debug-js/debug)
(formerly maintained by [visionmedia](https://github.com/visionmedia)) that:

* Generates `log`, `logVerbose`, and `warn` functions based on a given namespace/scope.
* Specifies [`debug`](https://www.npmjs.com/package/debug) as a
  [`peerDependency`](https://nodejs.org/en/blog/npm/peer-dependencies/) so that the consuming
  application or addon can specify which version should be used (hopefully preventing version conflicts).


Compatibility
------------------------------------------------------------------------------

* Ember.js v3.24 or above
* Ember CLI v3.24 or above
* Node.js v12 or above


Installation
------------------------------------------------------------------------------

```
ember install ember-optional-debug
```


Usage
------------------------------------------------------------------------------

```js
// environment.js
'use strict';

module.exports = function (environment) {
  let ENV = {
    modulePrefix: 'my-thing',
    environment,
    // ...
    'ember-optional-debug': {
      //logProvider: 'none', // log = () => undefined
      //logProvider: 'console', // log = console.log.bind(console)
      logProvider: 'debug', // log = debug(yourNamespace)
    },
    // ...
  };
  // ...
  return ENV;
};
```

```js
//import { getLoggingFunctions } from `ember-optional-debug`;
import { getLoggingFunctions } from "ember-optional-debug/utils/log";

const { log, logVerbose, warn } = getLoggingFunctions(`my-namespace:foo`);
log('hello'); // [console.log] my-namespace:foo hello
logVerbose('world'); // [console.log] my-namespace:foo:verbose world
warn('boom'); // [console.warn] my-namespace:foo boom
```

Contributing
------------------------------------------------------------------------------

See the [Contributing](CONTRIBUTING.md) guide for details.


License
------------------------------------------------------------------------------

This project is licensed under the [MIT License](LICENSE.md).
