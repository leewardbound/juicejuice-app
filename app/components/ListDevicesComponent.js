import React, { Component } from 'react';
import LocalStorageMixin from 'react-localstorage';
import DeviceStore from '../stores/DeviceStore';
import LocalStore from '../stores/LocalStore';
import log from '../stores/log';
import HomeActions from '../actions/HomeActions';
import _ from 'lodash';

function getAppState() {
  return {
    devices: DeviceStore.getAll()
  };
}

export default class ListDevicesComponent extends Component {
  constructor () {
    super();
    this.state = getAppState()
  }

  componentDidMount() {
    DeviceStore.addChangeListener(this.onChange);
  }

  componentWillUnmount() {
    DeviceStore.removeChangeListener(this.onChange);
  }

  onChange = () => {
    this.setState(getAppState());
  }

  render() {
    let clearall = function() {
        DeviceStore.clearAll()
    }
    localStorage.state = JSON.stringify(this.state)
    let click = function(device) {
        return function() {
            log.info('Sending')
            DeviceStore.send_message(device, 'hi')
        }
    }
    return (
      <div>
        <ul className='table-view'>
        {
          _.map(this.state.devices || [], function(device) {
                return (
                  <li key={device.address} className='table-view-cell media'>
                  <div className='media-body'>{device.name} <br />{device.rssi}</div>
                  <a onClick={click(device)}>Connect</a>
                  </li>
                )
              })
            }
        </ul>
        <a onClick={clearall}>Clear All</a>
      </div>
    );
  }
}

ListDevicesComponent.config = { name: 'devices', title: 'Devices', path: 'devices' };
