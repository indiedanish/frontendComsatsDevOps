import React, { useContext, useLayoutEffect, useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import classNames from 'classnames';
import { useTour } from '@reactour/tour';
import Button from '../../../components/bootstrap/Button';
import { HeaderRight } from '../../../layout/Header/Header';
import OffCanvas, {
	OffCanvasBody,
	OffCanvasHeader,
	OffCanvasTitle,
} from '../../../components/bootstrap/OffCanvas';
import Alert from '../../../components/bootstrap/Alert';
import Dropdown, {
	DropdownItem,
	DropdownMenu,
	DropdownToggle,
} from '../../../components/bootstrap/Dropdown';
import Icon from '../../../components/icon/Icon';
import ThemeContext from '../../../contexts/themeContext';
import LANG, { getLangWithKey } from '../../../lang';
import showNotification from '../../../components/extras/showNotification';
import useDarkMode from '../../../hooks/useDarkMode';
import Popovers from '../../../components/bootstrap/Popovers';
import Spinner from '../../../components/bootstrap/Spinner';
import { Link, useNavigate, useLocation } from "react-router-dom";
import axios from 'axios'

//------------------------------------------------------------------------
import { Cookies } from "react-cookie";
import jwt_decode from "jwt-decode";
axios.defaults.withCredentials = true;
import useAuth from "../../../hooks/useAuth";
import { io } from "socket.io-client";
import { is } from 'date-fns/locale';


//-------------------------------------------------------------------------








// eslint-disable-next-line react/prop-types
const CommonHeaderRight = ({ beforeChildren, afterChildren }) => {
	

	const navigate = useNavigate();
	const location = useLocation();
	const { darkModeStatus, setDarkModeStatus } = useDarkMode();

	const { fullScreenStatus, setFullScreenStatus } = useContext(ThemeContext);
	const styledBtn = {
		color: darkModeStatus ? 'dark' : 'light',
		hoverShadow: 'default',
		isLight: !darkModeStatus,
		size: 'lg',
	};

	const [offcanvasStatus, setOffcanvasStatus] = useState(false);

	const { i18n } = useTranslation();

	const changeLanguage = (lng) => {
		i18n.changeLanguage(lng);
		showNotification(
			<span className='d-flex align-items-center'>
				<Icon icon={getLangWithKey(lng)?.icon} size='lg' className='me-1' />
				<span>{`Language changed to ${getLangWithKey(lng)?.text}`}</span>
			</span>,
			'You updated the language of the site. (Only "Aside" was prepared as an example.)',
		);
	};

	/**
	 * Language attribute
	 */
	useLayoutEffect(() => {
		document.documentElement.setAttribute('lang', i18n.language);
	});

	const { setIsOpen } = useTour();

	const logout = async () => {
		await axios.get(
			"http://localhost:3500/logout",

			{
				withCredentials: true,
			}
		);


		window.location.reload(false);
	}






	//============================================================================================

	//Notifications


	const [studentSelf, setstudentSelf] = useState([]);


	const [notifications, setNotifications] = useState([]);

	const [arrivalMessage, setArrivalMessage] = useState(null);


	const socket = useRef();
	const scrollRef = useRef();





	useEffect(() => {
		socket.current = io("ws://localhost:8900");
		socket.current.on("getNotification", (data) => {
		  setArrivalMessage({
			title: data.title,
			sender: data.senderId,
			content: data.content,
			createdAt: Date.now(),
			
		  });
		});
	  }, []);

	  useEffect(() => {
		arrivalMessage &&
		studentSelf?.equals(arrivalMessage.sender) &&
		  setNotifications((prev) => [...prev, arrivalMessage]);
		  console.log("HIsasas")
	  }, [arrivalMessage, studentSelf, notifications]);
	
	  useEffect(() => {
		socket.current.emit("addUser", studentSelf._id);
		socket.current.on("getUsers", (users) => {
			console.log("users")
	
			console.log(users)
			getstudentSelf()

		 
		});
	  }, [arrivalMessage]);



	useEffect(() => {
		getstudentSelf();


	}, []);



	const reload = () => {
		getstudentSelf()
	}
	const { auth, setAuth } = useAuth();

	console.log("AUTHHHHDAN", auth);









	const getstudentSelf = async () => {
		const cookies = new Cookies();
		const token = cookies.get("jwt");

		var decoded = jwt_decode(token);

		const response = await axios.post(
			"http://localhost:3500/student/getStudent",
			{ RegNo: decoded.RegNo },
			{
				withCredentials: true, //correct
			}
		);

		setstudentSelf(response.data)
		setNotifications(response.data.Notifications)
		;
		console.log("STUDENT himself: ", response.data);

	};










	//============================================================================================







	return (
		<HeaderRight>
			<div className='row g-3'>
				{beforeChildren}


				{/* Dark Mode */}
				<div className='col-auto'>
					<Popovers trigger='hover' desc='Dark / Light mode'>
						<Button
							// eslint-disable-next-line react/jsx-props-no-spreading
							{...styledBtn}
							onClick={() => setDarkModeStatus(!darkModeStatus)}
							className='btn-only-icon'
							data-tour='dark-mode'>
							<Icon
								icon={darkModeStatus ? 'DarkMode' : 'LightMode'}
								color={darkModeStatus ? 'info' : 'warning'}
								className='btn-icon'
							/>
						</Button>
					</Popovers>
				</div>




				{/*	Full Screen */}
				{/* <div className='col-auto'>
					<Popovers trigger='hover' desc='Fullscreen'>
						<Button
							// eslint-disable-next-line react/jsx-props-no-spreading
							{...styledBtn}
							icon={fullScreenStatus ? 'FullscreenExit' : 'Fullscreen'}
							onClick={() => setFullScreenStatus(!fullScreenStatus)}
							aria-label='Toggle dark mode'
						/>
					</Popovers>
				</div> */}


				{/* Quick Panel */}
				{/* <div className='col-auto'>
					<Dropdown>
						<DropdownToggle hasIcon={false}>
							<Button {...styledBtn} icon='Tune' aria-label='Quick menu' />
						</DropdownToggle>
						<DropdownMenu isAlignmentEnd size='lg' className='py-0 overflow-hidden'>
							<div className='row g-0'>
								<div
									className={classNames(
										'col-12',
										'p-4',
										'd-flex justify-content-center',
										'fw-bold fs-5',
										'text-info',
										'border-bottom border-info',
										{
											'bg-l25-info': !darkModeStatus,
											'bg-lo25-info': darkModeStatus,
										},
									)}>
									Quick Panel
								</div>
								<div
									className={classNames(
										'col-6 p-4 transition-base cursor-pointer bg-light-hover',
										'border-end border-bottom',
										{ 'border-dark': darkModeStatus },
									)}>
									<div className='d-flex flex-column align-items-center justify-content-center'>
										<Icon icon='Public' size='3x' color='info' />
										<span>Dealers</span>
										<small className='text-muted'>Options</small>
									</div>
								</div>
								<div
									className={classNames(
										'col-6 p-4 transition-base cursor-pointer bg-light-hover',
										'border-bottom',
										{ 'border-dark': darkModeStatus },
									)}>
									<div className='d-flex flex-column align-items-center justify-content-center'>
										<Icon icon='Upcoming' size='3x' color='success' />
										<span>Inbox</span>
										<small className='text-muted'>Configuration</small>
									</div>
								</div>
								<div
									className={classNames(
										'col-6 p-4 transition-base cursor-pointer bg-light-hover',
										'border-end',
										{ 'border-dark': darkModeStatus },
									)}>
									<div className='d-flex flex-column align-items-center justify-content-center'>
										<Icon icon='Print' size='3x' color='danger' />
										<span>Print</span>
										<small className='text-muted'>Settings</small>
									</div>
								</div>
								<div className='col-6 p-4 transition-base cursor-pointer bg-light-hover'>
									<div className='d-flex flex-column align-items-center justify-content-center'>
										<Icon icon='ElectricalServices' size='3x' color='warning' />
										<span>Power</span>
										<small className='text-muted'>Mode</small>
									</div>
								</div>
							</div>
						</DropdownMenu>
					</Dropdown>
				</div> */}

				{/*	Notifications */}
				<div className='col-auto'>
					<Button
						// eslint-disable-next-line react/jsx-props-no-spreading
						{...styledBtn}
						icon='Notifications'
						onClick={() => { setOffcanvasStatus(true)}}
						aria-label='Notifications'
					/>
				</div>
				<div className='col-auto'>
					<Popovers trigger='hover' desc='Logout'>
						<Button
							// eslint-disable-next-line react/jsx-props-no-spreading
							{...styledBtn}
							onClick={() => logout()}
							className='btn-only-icon'
							data-tour='dark-mode'>
							<Icon
								icon='Logout'
								color={darkModeStatus ? 'info' : 'warning'}
								className='btn-icon'
							/>
						</Button>
					</Popovers>
				</div>
				{afterChildren}
			</div>

			<OffCanvas
				id='notificationCanvas'
				titleId='offcanvasExampleLabel'
				placement='end'
				isOpen={offcanvasStatus}
				setOpen={setOffcanvasStatus}>
				<OffCanvasHeader setOpen={setOffcanvasStatus}>
					<OffCanvasTitle id='offcanvasExampleLabel'>Notifications</OffCanvasTitle>
				</OffCanvasHeader>

				<OffCanvasBody>

					{notifications.slice(0).reverse().map((msg) => (


						msg.title == "Message" ? (


							<Alert icon={msg.senderImg} isLight color='success' className='flex-nowrap' isDismissible>
								<div className='flex flex-col'>
								<div className={'font-semibold font-serif '}>
								 New Message


								</div>
									<div>
									{`${msg.content}`}


									</div>
									<div className={'text-sm'}>
									From:  {`${msg.sender}`}

									</div>

								</div>

						

							</Alert>



						) : msg.title == "Requirement" ? (

							<Alert icon={msg.senderImg} isLight color='primary' className='flex-nowrap' isDismissible>
							<div className='flex flex-col'>
							<div className={'font-semibold font-serif '}>
								 New Requirement Assigned


								</div>
								<div>
								{`${msg.content}`}


								</div>
								<div className={'text-sm'}>
								From:  {`${msg.sender}`}

								</div>

							</div>

					

						</Alert>
							
					) : 
					msg.title == "Comment" ? (

						<Alert icon={msg.senderImg} isLight color='warning' className='flex-nowrap' isDismissible>
						<div className='flex flex-col'>
						<div className={'font-semibold font-serif '}>
							 New Comment


							</div>
							<div className={'text-sm'}>
							View Following Requirement for more info: 
							</div>


							<div>
							"{`${msg.content}`}"


							


							</div>
							<div className={'text-sm'}>
							From:  {`${msg.sender}`}

							</div>

						</div>

				

					</Alert>
						
				) :
				<Alert icon='Inventory2' isLight color='danger' className='flex-nowrap'>
				There are products that need to be packaged.
			</Alert>
					))
				}


				
					
					
				</OffCanvasBody>
			</OffCanvas>




		</HeaderRight>
	);
};
CommonHeaderRight.propTypes = {
	beforeChildren: PropTypes.node,
	afterChildren: PropTypes.node,
};
CommonHeaderRight.defaultProps = {
	beforeChildren: null,
	afterChildren: null,
};

export default CommonHeaderRight;
