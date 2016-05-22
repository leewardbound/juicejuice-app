import React, { Component } from 'react';
import HomeStore from '../stores/HomeStore';
import BluetoothStore from '../stores/HomeStore';
import HomeActions from '../actions/HomeActions';

function getAppState() {
  return {
    contacts: HomeStore.getAll(),
    devices: DeviceStore.getAll(),
  };
}

export default class HomeComponent extends Component {
  constructor () {
    super();
    this.state = getAppState()
  }

  componentDidMount() {
    DeviceStore.startScanning();
    HomeActions.getContacts();
    HomeStore.addChangeListener(this.onChange);
  }

  componentWillUnmount() {
    HomeStore.removeChangeListener(this.onChange);
  }

  onChange = () => {
    this.setState(getAppState());
  }

  render() {
    return (
      <div>
        <ul className='table-view'>
        Home
        </ul>
      </div>
    );
  }
}

HomeComponent.config = { name: 'home', title: 'Home', path: 'home' };
