import { register } from '../dispatchers/ApplicationDispatcher';
import React from 'react';
import ApplicationStore from './ApplicationStore';
import TimeAgo from 'react-timeago';

function getColor(level){
    if(level == 'log') return 'black';
    if(level == 'warn') return 'orange';
    if(level == 'error') return 'red';
    return 'blue'
}

class log extends ApplicationStore {
  constructor() {
    super();
    this.data = []
    this.subscribe(() => this._registerToActions.bind(this));
  }

  _registerToActions(action) {
    this.emitChange();
  };

  subscribe(actionSubscribe) {
    this._dispatchToken = register(actionSubscribe());
  }

  addChangeListener(callback) {
    this.on('STORE_CHANGE', callback);
  }

  removeChangeListener(callback) {
    this.removeListener('STORE_CHANGE', callback);
  }

  addEntry(level, ...datum) {
    let at = new Date();
    let datum_strs = _.map(datum, (d) =>
                          _.isObject(d) ? JSON.stringify(d) : d)
    // Console logging output
    let line = <div>
      <span style={{color: getColor(level), fontWeight: 'bold'}}>
      <TimeAgo date={at} /> | {level}
      </span> {datum_strs.join(' ')}
    </div>
    let entry = {
        'at': at,
        'level': level,
        'datum': datum,
        'line': line,
        'color': getColor(level),
    }
    entry.id = this.data.length
    _.map(datum, (d) => window.console[level](d))
    this.data.push(entry);
    this.emitChange();
  }

  debug(...datum) { this.addEntry('debug', ...datum) }
  log(...datum) { this.addEntry('log', ...datum) }
  info(...datum) { this.addEntry('info', ...datum) }
  warn(...datum) { this.addEntry('warn', ...datum) }
  error(...datum) { this.addEntry('error', ...datum) }

  history(limit=10) {
      return _.slice(this.data, -10, 10).reverse()
  }

}

export default new log();
