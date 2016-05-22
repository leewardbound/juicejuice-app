import React, { Component } from 'react';
import { RouteHandler, Link } from 'react-router';
import ApplicationActions from '../actions/ApplicationActions';
import DeviceStore from '../stores/DeviceStore';
import LogViewer from './LogViewer';

export default class ApplicationComponent extends Component {
  render() {
    DeviceStore.startScanning()
    return <div>
        <header className='bar bar-nav'>
          <h1 className='title'>react-cordova</h1>
        </header>
        <section id='main' className='content'>
          <RouteHandler />
          <LogViewer />
        </section>
        <footer className='bar bar-tab'>
          <Link className='tab-item' to="home">
            <span className="icon icon-home"></span>
            <span className="tab-label">Home</span>
          </Link>
          <Link className='tab-item' to="devices">
            <span className="icon icon-star"></span>
            <span className="tab-label">Devices</span>
          </Link>
        </footer>
     </div>;
  }
};
