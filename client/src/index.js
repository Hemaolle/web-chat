import React from 'react';
import ReactDOM from 'react-dom';
import Popup from 'react-popup';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import './popup-styles.css'

// We must render the popup first so that it's usable in componentDidMount function of the app.
ReactDOM.render(<Popup />, document.getElementById('popupContainer'));
ReactDOM.render(<App pollInterval={2000}/>, document.getElementById('root'));

registerServiceWorker();
