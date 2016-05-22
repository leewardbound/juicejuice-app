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
      this.service = this.service || new BluetoothService()
      this.service.startScanning()
  }

  stopScanning() {
      this.service = this.service || new BluetoothService()
      this.service.stopScanning()
  }
}

export default new DeviceStore();
