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

      let store = this;

      function updateDevice(device, devices) {
          store.set(device.address, device)
      }
      this.service.startScanning(updateDevice)
  }

  stopScanning() {
      this.service = this.service || new BluetoothService()
      this.service.stopScanning()
  }

  send_message(device, data, success) {
      this.service.connect(device.address,
          () => this.emitChange(),
          () => this.service.sendData(device, data,
                () => this.service.disconnect(device, 'Finished send_message',
                      () => _.isFunction(success) && success()))
      )
  }

}

export default new DeviceStore();
