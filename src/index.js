import { ColorModeScript } from '@chakra-ui/react';
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import reportWebVitals from './reportWebVitals';
import * as serviceWorker from './serviceWorker';
import { FirebaseAppProvider } from 'reactfire';

const firebaseConfig = {
	apiKey: 'AIzaSyC-IH4GiQKEh5qtZZV72VzZHHbZKPI6sFw',
	authDomain: 'ew-purchasing.firebaseapp.com',
	projectId: 'ew-purchasing',
	storageBucket: 'ew-purchasing.appspot.com',
	messagingSenderId: '41829733165',
	appId: '1:41829733165:web:844f4c511d472d71f8b9a4',
	measurementId: 'G-9KFHP8FPE2'
};

ReactDOM.render(
	<FirebaseAppProvider firebaseConfig={firebaseConfig}>
		<ColorModeScript />
		<App />
	</FirebaseAppProvider>,
	document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://cra.link/PWA
serviceWorker.unregister();

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
