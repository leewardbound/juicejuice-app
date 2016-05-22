import ApplicationDispatcher from '../dispatchers/ApplicationDispatcher';
import BLE from './BLE'
import request from 'request';
import log from '../stores/log'

var manager = {}
var analog_enabled;
manager.RBL_SERVICE_UUID = '713d0000-503e-4c75-ba94-3148f18d941e';
manager.RBL_CHAR_TX_UUID = '713d0002-503e-4c75-ba94-3148f18d941e';
manager.RBL_CHAR_RX_UUID = '713d0003-503e-4c75-ba94-3148f18d941e';
manager.RBL_TX_UUID_DESCRIPTOR = '00002902-0000-1000-8000-00805f9b34fb';
manager.devices = {};
var UPDATE_DEBOUNCE = 30;

manager.initialize = function()
{
	manager.connected = false;
	analog_enabled = false;
	manager.devices = {};
  log.debug('Initialized!')
  log.info('JuiceJuice Brain App Version 1.0')
  return manager;
};

export default class BluetoothService {
  constructor() {
      if(!window.cordova) return log.warn('Bluetooth not available without Cordova')
  }

  driver() {
      return this._driver = this._driver || BLE(cordova)
  }

  stopScanning() {
      this.driver().stopScan()
  }

  startScanning() {
      log.debug("Starting the scanner")
      let services = [manager.RBL_SERVICE_UUID];
      if (cordova.platformId === 'xandroid')  // Android filtering is broken
          services = []
      this.driver().startScan(services, this.onDeviceSeen, this.onError);
  }
  onDeviceSeen(device) {
      if(!_.isObject(manager.devices[device.address]))
          log.debug('Found device: ', device)
      manager.devices[device.address] = device;
  }
  onError(error) {
      log.error('Scanning error: ', error)
  }
  get (options = {}) {
  }
  post (options = {}) {
  }
};

export default BluetoothService;
