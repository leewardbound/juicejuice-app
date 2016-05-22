import ApplicationStore from './ApplicationStore';
import ActionTypes from '../constants/ActionTypes';
import LocalStore from './LocalStore.js';
import BluetoothService from '../services/BluetoothService';
import log from './log.js';

class DeviceStore extends ApplicationStore {
  constructor() {
    super();
    this.data =  LocalStore.get('devices') || {}
    this.subscribe(() => this._registerToActions.bind(this));
  }

  _registerToActions(action) {
    switch(action.type) {
      case ActionTypes.DEVICES_CHANGE:
        this.setAll(action.body.devices);
        break;
      default:
        break;
    }
    this.emitChange();
  }

  startScanning() {
      BluetoothService.startScanning()
  }

  stopScanning() {
      BluetoothService.stopScanning()
  }
}

export default new DeviceStore();
