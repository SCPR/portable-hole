'use strict';

module.exports = class {
  constructor(){
    this._callbacks = {};
  }

  on(event, callback) {
    this._populate(event);
    this._callbacks[event].push(callback);
  }

  off(event, callback) {
    this._populate(event);
    let callbacks = this._callbacks[event];
    let index     = callbacks.indexOf(callback);
    callbacks.splice(index, 1);
  }

  trigger(event) {
    this._populate(event);
    this._callbacks[event].forEach((callback) => {
      setTimeout((() => { callback();}), 0);
    })
  }

  _populate(event) {
    this._callbacks[event] = this._callbacks[event] || [];
  }

}
