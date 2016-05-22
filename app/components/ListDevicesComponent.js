import React, { Component } from 'react';
import LocalStorageMixin from 'react-localstorage';
import DeviceStore from '../stores/DeviceStore';
import LocalStore from '../stores/LocalStore';
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
    //HomeActions.getDevices();
    DeviceStore.addChangeListener(this.onChange);
  }

  componentWillUnmount() {
    DeviceStore.removeChangeListener(this.onChange);
  }

  onChange = () => {
    this.setState(getAppState());
  }

  render() {
    let addone = function() {
        let d = {'first': 'lee', 'last': 'bound', 'id': Math.random() * 123};
        DeviceStore.set(Math.random(), d)
    }
    let clearall = function() {
        DeviceStore.clearAll()
    }
    localStorage.state = JSON.stringify(this.state)
    return (
      <div>
        <ul className='table-view'>
        {
          _.map(this.state.devices || [], function(contact) {
                return (
                  <li key={contact.id} className='table-view-cell media'>
                  <div className='media-body'>{contact.first} {contact.last}</div>
                  </li>
                )
              })
            }
        </ul>
        <a onClick={addone}>Add One</a>
        <br /><br /><br />
        <a onClick={clearall}>Clear All</a>
      </div>
    );
  }
}

ListDevicesComponent.config = { name: 'devices', title: 'Devices', path: 'devices' };
