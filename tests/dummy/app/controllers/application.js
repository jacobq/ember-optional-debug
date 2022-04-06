import { tracked } from '@glimmer/tracking';
import Controller from '@ember/controller';
import { action } from '@ember/object';
import config from 'ember-get-config';
import { getLoggingFunctions } from 'ember-optional-debug/utils/log';

export default class ApplicationController extends Controller {
  @tracked config = config;
  @tracked mode = config?.['ember-optional-debug']?.logProvider || 'disabled';
  @tracked logProviderOptions = ['none', 'console', 'debug'];

  get fullConfig() {
    return JSON.stringify(this.config, null, 2);
  }

  get addonConfig() {
    return JSON.stringify(this.config?.['ember-optional-debug'], null, 2);
  }

  @action
  changeMode(event) {
    this.mode = event.target.value;
  }

  @action
  log() {
    const { log } = getLoggingFunctions(`dummy:application:controller`, {
      logProvider: this.mode,
    });
    log('Testing log function', Date.now());
  }

  @action
  logVerbose() {
    const { logVerbose } = getLoggingFunctions(`dummy:application:controller`, {
      logProvider: this.mode,
    });
    logVerbose('Testing logVerbose function', Date.now());
  }

  @action
  warn() {
    const { warn } = getLoggingFunctions(`dummy:application:controller`, {
      logProvider: this.mode,
    });
    warn('Testing warn function', Date.now());
  }
}
