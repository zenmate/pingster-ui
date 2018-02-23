import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import { pingster_api } from 'c0nfig';

function isConfigValid () {
  if (!pingster_api) {
    console.error('pingster host is not defined, abroad!');
    return false;
  }

  return true;
}

if (isConfigValid()) {
  ReactDOM.render(<App />, document.getElementById('root'));
  registerServiceWorker();
}
