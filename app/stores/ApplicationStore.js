import { register } from '../dispatchers/ApplicationDispatcher';
import EventEmitter from 'events';
import ActionTypes from '../constants/ActionTypes';
import _ from 'lodash'

export default class ApplicationStore extends EventEmitter {
  constructor() {
    super();
    this.data = {};
  }

  subscribe(actionSubscribe) {
    this._dispatchToken = register(actionSubscribe());
  }

  addChangeListener(callback) {
    this.on('STORE_CHANGE', callback);
  }

  removeChangeListener(callback) {
    this.removeListener('STORE_CHANGE', callback);
  }

  get(key) {
    if(this.data[key] === undefined) {
      return {};
    } else {
      return this.data[key];
    }
  }

  set(key, value) {
    this.data[key] = value;
    this.emitChange('STORE_CHANGE');
  }

  remove(key) {
    this.data.delete(key);
    this.emitChange('STORE_CHANGE');
  }

  setAll(items) {
    this.data = new Set(items);
    this.emitChange('STORE_CHANGE');
  }

  clearAll() {
    this.data = {};
    this.emitChange('STORE_CHANGE');
  }

  emitChange() {
    this.emit('STORE_CHANGE');
  }

  getAll() {
    return this.data;
  }
}

ApplicationStore.dispatchToken = null;
