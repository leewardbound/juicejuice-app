import React, { Component } from 'react';
import _ from 'lodash';
import log from '../stores/log';

function getLogState(...params) {
    return {
        logs: log.history(...params)
    }
}

export default class LogViewer extends Component {
  constructor () {
    super();
    this.state = getLogState();
  }

  componentDidMount() {
    log.addChangeListener(this.onChange);
  }

  componentWillUnmount() {
    log.removeChangeListener(this.onChange);
  }

  onChange = () => {
    this.setState(getLogState());
  }

  render() {
    return (
      <div>
      <hr />
      <h5>Debug</h5>
      {
          _.map(this.state.logs, (i) =>
                <li key={i.id}>{i.line}</li>)
      }
      </div>
    );
  }
}

LogViewer.config = { name: 'logs', title: 'Logs', path: 'logs' };
