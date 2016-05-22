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

  startScanning(callback) {
      //Singleton
      if(this.manager) return
      log.debug("Starting the scanner")
      let services = [manager.RBL_SERVICE_UUID];
      this.manager = manager.initialize()
      if (cordova.platformId === 'xandroid')  // Android filtering is broken
          services = []
      let service = this;

      function onDeviceSeen(device) {
          if(!_.isObject(manager.devices[device.address]))
          {
              service.registerDevice(device, callback)
          }
          else
          {
            let age = new Date() - manager.devices[device.address].last_seen
            if(age > 2 * 1000)
            {
              service.updateDevice(device, callback)
            }
          }
      }

      function onError(error) {
          log.error('Scanning error: ', error)
      }

      this.driver().startScan(services, onDeviceSeen, onError);
  }


  updateDevice(device, callback) {
      device.last_seen = new Date();
      manager.devices[device.address] = device;
      _.isFunction(callback) && callback(device, manager.devices)
  }

  registerDevice(device, callback) {
      log.info('Found device: ', device.address, device.name)
      this.updateDevice(device, callback)
  }
  connect(address, onUpdate, onSuccess) {
      var device = this.manager.devices[address];
      if(this.manager.connection && this.manager.connection != device)
      {
        log.warn('Skipping connection, already connected to another device');
        return;
      }
      if(!device) return;
      if(device.connected) this.disconnect(device);
      // Some dumb timeouts
      //if(device.last_connect_ago() < UPDATE_DEBOUNCE || device.services === 0) return;

      device.last_connect_attempt = new Date().getTime()/1000.0;
      this.manager.connection = device;
      _.isFunction(onUpdate) && onUpdate(device);

      log.debug('  Trying to connect to ' + device.name);
      let service = this;
      let driver = this.service;
      let manager = this.manager;

      function onConnectSuccess(device)
      {
        log.debug('  Shook hands with ' + device.name + ', reading services...');

        function onServiceSuccess(device)
        {
          log.debug('  Found services on ' + device.name + '...');
          // now connected
          manager.connected = true;
          manager.devices[address] = device;
          device.services = 1;
          _.isFunction(onUpdate) && onUpdate(device)

          driver.write(
            device.address,
            manager.RBL_CHAR_TX_UUID,
            manager.RBL_TX_UUID_DESCRIPTOR,
            new Uint8Array([1,0]),
            function()
            {
              log.info('  Successfully setup with '+device.name+'!');
              device.connected = true;
              _.isFunction(onUpdate) && onUpdate(device);
              _.isFunction(onSuccess) && onSuccess(device);
              //device.send_scene();
              log.debug('  Setting time on '+ device.name)

              service.sendData(device,
                                  manager.getTimeData(),
                                  function(device) {
                                      log.info('  Done flashing '+ device.name)
                                      device.updated = true;
                                      service.disconnect(device.address)
                                  }
                              )
            },

            function(errorCode)
            {
              // Disconnect and give user feedback.
              manager.disconnect(address, 'Failed to set descriptor.');

              // Write debug information to console.
              log.error('Error: writeDescriptor on '+device.name+': ' + errorCode + '.');
            }
          );
          function failedToEnableNotification(erroCode)
          {
            log.error('BLE enableNotification error: ' + errorCode);
          }

          device.startNotification(
            manager.RBL_CHAR_TX_UUID,
            function(data) { service.receivedData(device, data) },
            function(errorcode)
            {
              log.error('BLE enableNotification error: ' + errorCode);
            }
          );


        };

        function onServiceFailure(errorCode)
        {
          // Skip doing anything when device disconnects
          if(errorCode == 'device not found') return;
          // Disconnect and show an error message to the user.
          manager.disconnect(address, 'Device is not from RedBearLab');

          // Write debug information to console.
          log.error('Error reading '+device.name+' services: ' + errorCode);
          device.services = 0;
          manager.scope.$apply();
        };

        // Connect to the managerropriate BLE service
        driver.readServices(
          [manager.RBL_SERVICE_UUID],
          onServiceSuccess,
          onServiceFailure
        );
      };

      function onConnectFailure(errorCode)
      {
        // Disconnect and show an error message to the user.
        manager.disconnect(address, 'Disconnected from device');

        // Write debug information to console
        log.error('Error ' + errorCode);
        device.error = errorCode;
      };

      // Connect to our device
      log.debug('  Identifying service for communication');
     if(!device.mock) this.driver().connect(device.address, onConnectSuccess, onConnectFailure);
  };


  disconnect(address, errorMessage, onSuccess) {
      let device = this.manager.devices[address];
      if(!device) return;
      this.manager.connected = false;
      this.manager.connection = false;
      device.connected = false;
      // Stop any ongoing scan and close manager.
      log.debug('  All done with '+device.name+', closing gracefully...');
      //device.disconnect();
      this.driver().disconnect(address);
      _.isFunction(onSuccess) && onSuccess()
  };

  sendData(device, data, success) {
      if (device.connected)
      {
        function onMessageSendSuccess()
        {
          log.info('  Succeded to send message to '+device.name);
          if(success) success(device);
        }

        function onMessageSendFailure(errorCode)
        {
          log.error('  Failed to send data with error: ' + errorCode);
          this.disconnect(device.address, '  Failed to send data');
        }

        data = new Uint8Array(data);

        device.writeCharacteristic(
          this.manager.RBL_CHAR_RX_UUID,
          data,
          onMessageSendSuccess,
          onMessageSendFailure
        );
      }
      else
      {
        // Disconnect and show an error message to the user.
        this.disconnect(device.address, 'Disconnected');

        // Write debug information to console
        log.debug('  sendData error - Device '+device.name+' disconnected.');
      }
  };

  receivedData(device, data) {
    if (this.manager.connected)
    {
      var data = new Uint8Array(data);
      log.debug('  Data received: [' + data[0] +', ' + data[1] + ', ' + data[2] + ']');
    }
    else
    {
      // Disconnect and show an error message to the user.
      this.disconnect(device.address, 'Disconnected');

      // Write debug information to console
      log.error('Error - No device connected.');
    }
  };


  getTimeData () {
      var d = new Date();
      s = d.getTime() % 86400000;
      return [99,
                   //Math.floor(s/(256*256*256*256*256*256*256))%256,
                   //Math.floor(s/(256*256*256*256*256*256))%256,
                   //Math.floor(s/(256*256*256*256*256))%256,
                   //Math.floor(s/(256*256*256*256))%256,
                   Math.floor(s/(256*256*256))%256,
                   Math.floor(s/(256*256))%256,
                   Math.floor(s/256)%256,
                   s%256
      ];
    }
};

export default BluetoothService;
