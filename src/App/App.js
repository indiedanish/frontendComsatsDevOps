import React, { useContext, useEffect, useState, useLayoutEffect, useRef } from 'react';
import { ThemeProvider } from 'react-jss';
import { ReactNotifications } from 'react-notifications-component';
import { useFullscreen } from 'react-use';
import { Route, Routes } from 'react-router-dom';
// import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { ToastProvider } from 'react-toast-notifications';

import ThemeContext from '../contexts/themeContext';

import Aside from '../layout/Aside/Aside';
import Wrapper from '../layout/Wrapper/Wrapper';
import Portal from '../layout/Portal/Portal';
import { demoPages, layoutMenu } from '../menu';
import { Toast, ToastContainer } from '../components/bootstrap/Toasts';
import useDarkMode from '../hooks/useDarkMode';
import COLORS from '../common/data/enumColors';
import { getOS } from '../helpers/helpers';

import Login from '../pages/presentation/auth/Login';

import Dashboard from '../pages/dashboard/DashboardPage';

import ProtectedRoutes from './ProtectedRoutes';

import PublicRoutes from './PublicRoutes';

const App = () => {
	getOS();

	/**
	 * Dark Mode
	 */
	const { themeStatus, darkModeStatus } = useDarkMode();
	const theme = {
		theme: themeStatus,
		primary: COLORS.PRIMARY.code,
		secondary: COLORS.SECONDARY.code,
		success: COLORS.SUCCESS.code,
		info: COLORS.INFO.code,
		warning: COLORS.WARNING.code,
		danger: COLORS.DANGER.code,
		dark: COLORS.DARK.code,
		light: COLORS.LIGHT.code,
	};

	useEffect(() => {
		if (darkModeStatus) {
			document.documentElement.setAttribute('theme', 'dark');
		}
		return () => {
			document.documentElement.removeAttribute('theme');
		};
	}, [darkModeStatus]);

	/**
	 * Full Screen
	 */
	const { fullScreenStatus, setFullScreenStatus } = useContext(ThemeContext);
	const ref = useRef(null);
	useFullscreen(ref, fullScreenStatus, {
		onClose: () => setFullScreenStatus(false),
	});

	/**
	 * Modern Design
	 */
	useLayoutEffect(() => {
		if (process.env.REACT_APP_MODERN_DESGIN === 'true') {
			document.body.classList.add('modern-design');
		} else {
			document.body.classList.remove('modern-design');
		}
	});

	//	Add paths to the array that you don't want to be "Aside".
	const withOutAsidePages = [demoPages.login.path, demoPages.signUp.path, layoutMenu.blank.path];
	const [login, setlogin] = useState(true);

	const LoggingIn = () => {
		setlogin(true);
	};
	const LoggingOut = () => {
		setlogin(false);
	};

	return (
		<ThemeProvider theme={theme}>
			<ToastProvider components={{ ToastContainer, Toast }}>
				<div
					ref={ref}
					className='app'
					style={{
						backgroundColor: fullScreenStatus && 'var(--bs-body-bg)',
						zIndex: fullScreenStatus && 1,
						overflow: fullScreenStatus && 'scroll',
					}}>
					<Routes>
						{/* 						
						<Route path='/dashboard' element={<Dashboard/>}  />
						<Route path='*' element={<Aside />} /> */}

						<Route path='login' element={<PublicRoutes />}>
							<Route path='/login' element={<Login />} />
						</Route>

						<Route path='/' element={<ProtectedRoutes />}>
							{withOutAsidePages.map((path) => (
								<Route key={path} path={path} />
							))}
							<Route path='*' element={<Aside />} />
						</Route>

						{/* { withOutAsidePages.map((path) => (
							<Route key={path} path={path} />
						))}
					<Route path='*' element={<Aside />} /> */}
					</Routes>
					<Wrapper />
				</div>
				<Portal id='portal-notification'>
					<ReactNotifications />
				</Portal>
			</ToastProvider>
		</ThemeProvider>
	);
};

export default App;
