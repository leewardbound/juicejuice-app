import ApplicationDispatcher from '../dispatchers/ApplicationDispatcher';
import request from 'request';
import BLE from './BLE';
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

function startApp(BT) {
    //BT.startScanning();
}

export default class BluetoothService {
  constructor() {
      if(!window.cordova) return log.warn('Bluetooth not available without Cordova')
      this.driver = BLE(window.cordova)
      this.manager = manager.initialize()
  }

  stopScanning() {
      clearInterval(this._scan_interval);
  }

  startScanning() {
      this.stopScanning();
      this.scan();
      this._scan_interval = setInterval(this.scan, 10*1000);
  }

  scan () {
      if(!this.manager) return;
      if (cordova.platformId === 'android') { // Android filtering is broken
          BLE.scan([], 5, this.onDiscoverDevice, this.onError);
      } else {
          BLE.scan([redbear.serviceUUID], 5, this.onDiscoverDevice, this.onError);
      }
  }
  onDiscoverDevice(device) {
      log.debug('Found device: ', device)
  }
  onError(device) {
      log.debug('Scanning error: ', error)
  }
  get (options = {}) {
  }
  post (options = {}) {
  }
};

export default new BluetoothService();
