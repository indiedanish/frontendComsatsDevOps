
/* eslint-disable react/no-direct-mutation-state */
import React, { useContext, useEffect, useState, useLayoutEffect, useRef } from 'react';
import { ThemeProvider } from 'react-jss';
import { ReactNotifications } from 'react-notifications-component';
import { useFullscreen } from 'react-use';
import { Navigate, Route, Routes } from 'react-router-dom';
// import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { ToastProvider } from 'react-toast-notifications';

import ThemeContext from '../contexts/themeContext';

import AdminSidebar from '../layout/Aside/adminSidebar';
import Wrapper from '../layout/Wrapper/Wrapper';
import Portal from '../layout/Portal/Portal';
// eslint-disable-next-line no-unused-vars
import { demoPages, layoutMenu } from '../menu';
import { Toast, ToastContainer } from '../components/bootstrap/Toasts';
import useDarkMode from '../hooks/useDarkMode';
import COLORS from '../common/data/enumColors';
import { getOS } from '../helpers/helpers';
import { Outlet, Link } from "react-router-dom";
import Login from '../pages/presentation/auth/Login';
import { Cookies } from 'react-cookie';
import jwt_decode from "jwt-decode";

// import Layout from '../layout/Wrapper/Layout';


// import contents from '../routes/contentRoutes';

// import PAGE_404 from '../pages/presentation/auth/Page404';

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

	// eslint-disable-next-line no-unused-vars
	const [login, setlogin] = useState(true);
	// eslint-disable-next-line no-unused-vars
	const LoggingIn = () => {
		setlogin(true);
	};
	// eslint-disable-next-line no-unused-vars
	const LoggingOut = () => {
		setlogin(false);
	};
	const withOutAsidePages = [demoPages.login.path, demoPages.signUp.path, layoutMenu.blank.path, demoPages.page404.path];
	useEffect(() => {
		//check if the user is logged in
	}, [])

	const cookies = new Cookies();
	const token = cookies.get('jwt')
	var decoded = jwt_decode(token);
	console.log(decoded)


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



						{false ? "logged in" : <Route path="login" element={<Login />} />}

						<Route >
							{withOutAsidePages.map((path) => (
								<Route key={path} path={path} />
							))}
							<Route path='*' element={<AdminSidebar />} />
							{/* we will use authenticate here too, to make correct sidebar */}



						</Route>




					</Routes>
					<Wrapper />


					{/* <Routes>
				
		

						<Route  element={<PublicRoutes />}>
							<Route path='/login' element={<Login />} />
						</Route>

						<Route  element={<ProtectedRoutes />}>
							{withOutAsidePages.map((path) => (
								<Route key={path} path={path} />
							))}
							<Route path='*' element={<Aside />} />
						</Route>

						

					</Routes> */}

				</div>
				<Portal id='portal-notification'>
					<ReactNotifications />
				</Portal>
			</ToastProvider>
		</ThemeProvider>
	);
};

export default App;
