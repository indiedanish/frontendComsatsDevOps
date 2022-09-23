import React from 'react';
// import ReactDOM from 'react-dom'; // For React 17
import { createRoot } from 'react-dom/client'; // For React 18
import { BrowserRouter ,Routes,Route } from 'react-router-dom';
import './index.css';

import './styles/styles.scss';
import App from './App/App';
// import reportWebVitals from './reportWebVitals';
import { ThemeContextProvider } from './contexts/themeContext';
import './i18n';

const children = (
	<BrowserRouter>
		
			<ThemeContextProvider>



<App /> 

			
			</ThemeContextProvider>
	
	</BrowserRouter>
);

const container = document.getElementById('root');

// ReactDOM.render(children, container); // For React 17
createRoot(container).render(children); // For React 18

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();
