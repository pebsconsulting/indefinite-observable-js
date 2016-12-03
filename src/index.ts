/** @license
 *  Copyright 2016 - present The Material Motion Authors. All Rights Reserved.
 *
 *  Licensed under the Apache License, Version 2.0 (the "License"); you may not
 *  use this file except in compliance with the License. You may obtain a copy
 *  of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 *  WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
 *  License for the specific language governing permissions and limitations
 *  under the License.
 */

import {
  Unsubscribe,
  Subscription,
  Next,
  Observer,
  Creator,
  Listener,
} from './types';

export default class IndefiniteObservable<T> {
  _listeners = new Set();
  _creator: Creator;

  constructor(creator: Creator) {
    this._creator = creator;
  }

  subscribe(listener: Listener): Subscription {
    let stop: Unsubscribe;
    const listeners = this._listeners;

    if (!(listener as Observer).next) {
      listener = {
        next: (listener as Next),
      };
    }

    listeners.add(listener);

    if (listeners.size === 1) {
      stop = this._creator({
        next: this._next.bind(this),
      });
    }

    return {
      unsubscribe() {
        listeners.delete(listener);

        if (listeners.size === 0 && stop) {
          stop();
        }
      }
    }
  }

  _next(value: T) {
    this._listeners.forEach(
      listener => listener.next(value)
    );
  }
}
