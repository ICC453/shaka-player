/**
 * @license
 * Copyright 2016 Google Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

goog.provide('shaka.polyfill.IndexedDB');

goog.require('goog.asserts');
goog.require('shaka.log');
goog.require('shaka.polyfill');


/**
 * @summary A polyfill to patch IndexedDB bugs.
 */
shaka.polyfill.IndexedDB = class {
  /**
   * Install the polyfill if needed.
   */
  static install() {
    shaka.log.debug('IndexedDB.install');

    let disableIDB = false;
    if (shaka.util.Platform.isChromecast()) {
      shaka.log.debug('Removing IndexedDB from ChromeCast');
      disableIDB = true;
    } else {
      try {
        // This is necessary to avoid Closure compiler over optimize this
        // block and remove it if it looks like a noop
        if (window.indexedDB) {
          disableIDB = false;
        }
      } catch (e) {
        shaka.log.debug(
            'Removing IndexedDB due to an exception when accessing it');
        disableIDB = true;
      }
    }

    if (disableIDB) {
      delete window.indexedDB;
      goog.asserts.assert(
          !window.indexedDB, 'Failed to override window.indexedDB');
    }
  }
};


shaka.polyfill.register(shaka.polyfill.IndexedDB.install);
