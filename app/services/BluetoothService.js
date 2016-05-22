import ApplicationDispatcher from '../dispatchers/ApplicationDispatcher';
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

  stopScanning() {
      clearInterval(this._scan_interval);
  }

  startScanning() {
      log.debug("Scheduling scanner")
      this.stopScanning();
      this._scan_interval = setInterval(this.scan, 30*1000);
      this.scan();
  }

  scan () {
      this.manager = this.manager || manager.initialize()
      log.debug("Starting a scan...")
      if(!this.manager) return;
      if (cordova.platformId === 'android') { // Android filtering is broken
          cordova.ble.scan([], 5, this.onDiscoverDevice, this.onError);
      } else {
          cordova.ble.scan([redbear.serviceUUID], 5, this.onDiscoverDevice, this.onError);
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

export default BluetoothService;
