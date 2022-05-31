import React, { useCallback, useEffect, useState } from 'react';
import moment from 'moment';

import { Link, useNavigate } from 'react-router-dom';
import classNames from 'classnames';
import { useTour } from '@reactour/tour';
import PageWrapper from '../../layout/PageWrapper/PageWrapper';
import SubHeader, {
	SubHeaderLeft,
	SubHeaderRight,
	SubheaderSeparator,
} from '../../layout/SubHeader/SubHeader';
import Page from '../../layout/Page/Page';
import Button, { ButtonGroup } from '../../components/bootstrap/Button';
import Card, {
	CardActions,
	CardBody,
	CardHeader,
	CardLabel,
	CardSubTitle,
	CardTitle,
} from '../../components/bootstrap/Card';
import Chart from '../../components/extras/Chart';

import Dropdown, {
	DropdownItem,
	DropdownMenu,
	DropdownToggle,
} from '../../components/bootstrap/Dropdown';
import Alert, { AlertHeading } from '../../components/bootstrap/Alert';
import Icon from '../../components/icon/Icon';
import Badge from '../../components/bootstrap/Badge';

import Popovers from '../../components/bootstrap/Popovers';
import CommonAvatarTeam from '../../components/common/CommonAvatarTeam';
import CommonMyWallet from '../common/CommonMyWallet';

import Company1 from '../../assets/logos/company1.png';
import Company2 from '../../assets/logos/company2.png';
import Company3 from '../../assets/logos/company3.png';
import Company4 from '../../assets/logos/company4.png';

import UserContact from '../../components/UserContact';
import Avatar, { AvatarGroup } from '../../components/Avatar';
import USERS from '../../common/data/userDummyData';
import { demoPages } from '../../menu';
import data from '../../common/data/dummyProductData';
import { average, priceFormat } from '../../helpers/helpers';
import PercentComparison from '../../components/extras/PercentComparison';
import PaginationButtons, { dataPagination, PER_COUNT } from '../../components/PaginationButtons';
import useSortableData from '../../hooks/useSortableData';
import useDarkMode from '../../hooks/useDarkMode';
import Timeline, { TimelineItem } from '../../components/extras/Timeline';
import CommonTodo from '../common/CommonTodo';
import axios from 'axios';
import { getColorNameWithIndex } from '../../common/data/enumColors';

// eslint-disable-next-line react/prop-types
const TableRow = ({ id, image, name, category, series, color, stock, price, store }) => {
	const { darkModeStatus } = useDarkMode();

	const dummyOptions = {
		colors: [color],
		chart: {
			type: 'line',
			width: 100,
			height: 35,
			sparkline: {
				enabled: true,
			},
		},
		tooltip: {
			theme: 'dark',
			fixed: {
				enabled: false,
			},
			x: {
				show: false,
			},
			y: {
				title: {
					// eslint-disable-next-line no-unused-vars
					formatter(seriesName) {
						return '';
					},
				},
			},
		},
		stroke: {
			curve: 'smooth',
			width: 2,
		},
	};

	return (
		<tr>
			<th scope='row'>{id}</th>
			<td>
				<Link to={`../${demoPages.sales.subMenu.productID.path}/${id}`}>
					<img src={image} alt='' width={54} height={54} />
				</Link>
			</td>
			<td>
				<div>
					<Link
						to={`../${demoPages.sales.subMenu.productID.path}/${id}`}
						className={classNames('fw-bold', {
							'link-dark': !darkModeStatus,
							'link-light': darkModeStatus,
						})}>
						{name}
					</Link>
					<div className='text-muted'>
						<small>{category}</small>
					</div>
				</div>
			</td>
			<td>
				<Chart
					series={series}
					options={dummyOptions}
					type={dummyOptions.chart.type}
					height={dummyOptions.chart.height}
					width={dummyOptions.chart.width}
				/>
			</td>
			<td>
				<span>{stock}</span>
			</td>
			<td>
				<span>
					{price.toLocaleString('en-US', {
						style: 'currency',
						currency: 'USD',
					})}
				</span>
			</td>
			<td className='h5'>
				<Badge
					color={
						(store === 'Company A' && 'danger') ||
						(store === 'Company B' && 'warning') ||
						(store === 'Company C' && 'success') ||
						'info'
					}>
					{store}
				</Badge>
			</td>
		</tr>
	);
};

// eslint-disable-next-line react/prop-types
const AnswerCustomer = ({ id, imgWebp, img, name, job, value, color }) => {
	const { darkModeStatus } = useDarkMode();

	const [state] = useState({
		series: [value],
		options: {
			chart: {
				type: 'radialBar',
				width: 50,
				height: 50,
				sparkline: {
					enabled: true,
				},
			},
			dataLabels: {
				enabled: false,
			},
			plotOptions: {
				radialBar: {
					hollow: {
						margin: 0,
						size: '50%',
					},
					track: {
						margin: 0,
					},
					dataLabels: {
						show: false,
					},
				},
			},
			stroke: {
				lineCap: 'round',
			},
			colors: [
				(color === 'primary' && process.env.REACT_APP_PRIMARY_COLOR) ||
					(color === 'secondary' && process.env.REACT_APP_SECONDARY_COLOR) ||
					(color === 'success' && process.env.REACT_APP_SUCCESS_COLOR) ||
					(color === 'info' && process.env.REACT_APP_INFO_COLOR) ||
					(color === 'warning' && process.env.REACT_APP_WARNING_COLOR) ||
					(color === 'danger' && process.env.REACT_APP_DANGER_COLOR),
			],
		},
	});
	return (
		<div className='col-12'>
			<div className='row g-2'>
				<div className='col d-flex'>
					<div className='flex-shrink-0'>
						<Avatar
							src={img}
							srcSet={imgWebp}
							size={54}
							userName={name}
							color={color}
						/>
					</div>
					<div className='flex-grow-1 ms-3 d-flex justify-content-between align-items-center'>
						<div>
							<Link
								to={`../${demoPages.appointment.subMenu.employeeID.path}/${id}`}
								className={classNames('fw-bold fs-6 mb-0', {
									'link-dark': !darkModeStatus,
									'link-light': darkModeStatus,
								})}>
								{name}
							</Link>
							<div className='text-muted mt-n1'>
								<small>{job}</small>
							</div>
						</div>
					</div>
				</div>
				<div className='col-auto'>
					<div className='d-flex align-items-center'>
						<Popovers desc='Remaining time' trigger='hover'>
							<span className='me-3'>%{value}</span>
						</Popovers>
						<Chart
							series={state.series}
							options={state.options}
							type={state.options.chart.type}
							height={state.options.chart.height}
							width={state.options.chart.width}
							className='me-3'
						/>
						<Button
							color='info'
							isLight
							icon='ScheduleSend'
							className='text-nowrap'
							tag='a'
							href='mailto:example@site.com'>
							Send
						</Button>
					</div>
				</div>
			</div>
		</div>
	);
};

const DashboardPage = () => {
	/**
	 * Tour Start
	 */
	const { setIsOpen } = useTour();
	useEffect(() => {
		if (localStorage.getItem('tourModalStarted') !== 'shown') {
			setTimeout(() => {
				setIsOpen(true);
				localStorage.setItem('tourModalStarted', 'shown');
			}, 3000);
		}
		getTeams();
		getTasks();
		getStudents();

		return () => {};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const { themeStatus, darkModeStatus } = useDarkMode();

	const navigate = useNavigate();
	const handleOnClickToEmployeeListPage = useCallback(
		() => navigate(`../${demoPages.appointment.subMenu.employeeList.path}`),
		[navigate],
	);

	const TABS = {
		WEEKLY: 'Weekly',
		MONTHLY: 'Monthly',
		YEARLY: 'Yearly',
	};
	const [activeTab, setActiveTab] = useState(TABS.YEARLY);

	const [sales, setSales] = useState({
		series: [
			{
				data: [34, 32, 36, 34, 34],
			},
		],
		options: {
			colors: [process.env.REACT_APP_WARNING_COLOR],
			chart: {
				type: 'line',
				width: '100%',
				height: 150,
				sparkline: {
					enabled: true,
				},
			},
			tooltip: {
				theme: 'dark',
				fixed: {
					enabled: false,
				},
				x: {
					show: false,
				},
				y: {
					title: {
						// eslint-disable-next-line no-unused-vars
						formatter(seriesName) {
							return '';
						},
					},
				},
			},
			stroke: {
				curve: 'smooth',
				width: 2,
			},
		},
		sales: {
			compare: 24,
		},
		campaigns: {
			price: 3265.72,
			compare: 5000,
		},
		coupons: {
			price: 2654.2,
			compare: 2300,
		},
	});
	useEffect(() => {
		if (activeTab === TABS.YEARLY) {
			setSales({
				series: [
					{
						data: [34, 32, 36, 34, 34],
					},
				],
				sales: {
					compare: 24,
				},
				campaigns: {
					price: 3265.72,
					compare: 5000,
				},
				coupons: {
					price: 2654.2,
					compare: 2300,
				},
				options: sales.options,
			});
		}
		if (activeTab === TABS.MONTHLY) {
			setSales({
				series: [
					{
						data: [32, 35, 40, 30, 32],
					},
				],
				sales: {
					compare: 27,
				},
				campaigns: {
					price: 450,
					compare: 480,
				},
				coupons: {
					price: 98,
					compare: 120,
				},
				options: sales.options,
			});
		}
		if (activeTab === TABS.WEEKLY) {
			setSales({
				series: [
					{
						data: [28, 32, 30, 29, 30],
					},
				],
				sales: {
					compare: 12,
				},
				campaigns: {
					price: 94,
					compare: 80,
				},
				coupons: {
					price: 80,
					compare: 45,
				},
				options: sales.options,
			});
		}
		return () => {};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [activeTab]);

	const [year, setYear] = useState(Number(moment().format('YYYY')));
	const companies = [
		{ name: 'Company 1', img: Company1 },
		{ name: 'Company 2', img: Company2 },
		{ name: 'Company 3', img: Company3 },
		{ name: 'Company 4', img: Company4 },
	];
	const COMPANIES_TAB = {
		COMP1: companies[0].name,
		COMP2: companies[1].name,
		COMP3: companies[2].name,
		COMP4: companies[3].name,
	};
	const [activeCompanyTab, setActiveCompanyTab] = useState(COMPANIES_TAB.COMP1);
	function randomize(value, x = year) {
		if (x === 2019) {
			if (value.toFixed(0) % 2) {
				return (value * 1.5).toFixed(2);
			}
			return (value / 1.4).toFixed(2);
		}
		if (x === 2020) {
			if (value.toFixed(0) % 2) {
				return (value / 1.5).toFixed(2);
			}
			return (value * 1.4).toFixed(2);
		}
		if (x === 2021) {
			if (value.toFixed(0) % 2) {
				return (value / 2).toFixed(2);
			}
			return (value * 1.4).toFixed(2);
		}
		return value.toFixed(2);
	}

	const salesByStoreOptions = {
		chart: {
			height: 370,
			type: 'line',
			stacked: false,
			toolbar: { show: false },
		},
		colors: [
			process.env.REACT_APP_INFO_COLOR,
			process.env.REACT_APP_SUCCESS_COLOR,
			process.env.REACT_APP_WARNING_COLOR,
		],
		dataLabels: {
			enabled: false,
		},
		stroke: {
			width: [1, 1, 4],
			curve: 'smooth',
		},
		plotOptions: {
			bar: {
				borderRadius: 5,
				columnWidth: '20px',
			},
		},
		xaxis: {
			categories: [
				'Jan',
				'Feb',
				'Mar',
				'Apr',
				'May',
				'Jun',
				'Jul',
				'Aug',
				'Sep',
				'Oct',
				'Nov',
				'Dec',
			],
		},
		yaxis: [
			{
				axisTicks: {
					show: true,
				},
				axisBorder: {
					show: true,
					color: process.env.REACT_APP_INFO_COLOR,
				},
				labels: {
					style: {
						colors: process.env.REACT_APP_INFO_COLOR,
					},
				},
				title: {
					text: 'Income (thousand cores)',
					style: {
						color: process.env.REACT_APP_INFO_COLOR,
					},
				},
				tooltip: {
					enabled: true,
				},
			},
			{
				seriesName: 'Income',
				opposite: true,
				axisTicks: {
					show: true,
				},
				axisBorder: {
					show: true,
					color: process.env.REACT_APP_SUCCESS_COLOR,
				},
				labels: {
					style: {
						colors: process.env.REACT_APP_SUCCESS_COLOR,
					},
				},
				title: {
					text: 'Operating Cash Flow (thousand cores)',
					style: {
						color: process.env.REACT_APP_SUCCESS_COLOR,
					},
				},
			},
			{
				seriesName: 'Revenue',
				opposite: true,
				axisTicks: {
					show: true,
				},
				axisBorder: {
					show: true,
					color: process.env.REACT_APP_WARNING_COLOR,
				},
				labels: {
					style: {
						colors: process.env.REACT_APP_WARNING_COLOR,
					},
				},
				title: {
					text: 'Revenue (thousand cores)',
					style: {
						color: process.env.REACT_APP_WARNING_COLOR,
					},
				},
			},
		],
		tooltip: {
			theme: 'dark',
			fixed: {
				enabled: true,
				position: 'topLeft', // topRight, topLeft, bottomRight, bottomLeft
				offsetY: 30,
				offsetX: 60,
			},
		},
		legend: {
			horizontalAlign: 'left',
			offsetX: 40,
		},
	};
	const salesByStoreSeries1 = [
		{
			name: 'Income',
			type: 'column',
			data: [
				randomize(1.4),
				randomize(2),
				randomize(2.5),
				randomize(1.5),
				randomize(2.5),
				randomize(2.8),
				randomize(3.8),
				randomize(4.6),
			],
		},
		{
			name: 'Cash Flow',
			type: 'column',
			data: [
				randomize(1.1),
				randomize(3),
				randomize(3.1),
				randomize(4),
				randomize(4.1),
				randomize(4.9),
				randomize(6.5),
				randomize(8.5),
			],
		},
		{
			name: 'Revenue',
			type: 'line',
			data: [
				randomize(20),
				randomize(29),
				randomize(37),
				randomize(36),
				randomize(44),
				randomize(45),
				randomize(50),
				randomize(58),
			],
		},
	];
	const salesByStoreSeries2 = [
		{
			name: 'Income',
			type: 'column',
			data: [
				randomize(4.4),
				randomize(5),
				randomize(6.5),
				randomize(7.5),
				randomize(6.5),
				randomize(9.8),
				randomize(7.8),
				randomize(6.6),
			],
		},
		{
			name: 'Cash Flow',
			type: 'column',
			data: [
				randomize(3),
				randomize(3),
				randomize(5.1),
				randomize(5),
				randomize(7.1),
				randomize(9.9),
				randomize(8.5),
				randomize(9.5),
			],
		},
		{
			name: 'Revenue',
			type: 'line',
			data: [
				randomize(34),
				randomize(54),
				randomize(43),
				randomize(63),
				randomize(35),
				randomize(63),
				randomize(46),
				randomize(53),
			],
		},
	];
	const salesByStoreSeries3 = [
		{
			name: 'Income',
			type: 'column',
			data: [
				randomize(4),
				randomize(3),
				randomize(2.5),
				randomize(1.5),
				randomize(2.5),
				randomize(3.8),
				randomize(3.8),
				randomize(4.6),
			],
		},
		{
			name: 'Cash Flow',
			type: 'column',
			data: [
				randomize(2),
				randomize(5),
				randomize(6.1),
				randomize(2),
				randomize(6.1),
				randomize(3.9),
				randomize(6.5),
				randomize(8.5),
			],
		},
		{
			name: 'Revenue',
			type: 'line',
			data: [
				randomize(34),
				randomize(21),
				randomize(54),
				randomize(56),
				randomize(34),
				randomize(43),
				randomize(37),
				randomize(43),
			],
		},
	];
	const salesByStoreSeries4 = [
		{
			name: 'Income',
			type: 'column',
			data: [
				randomize(3),
				randomize(3.2),
				randomize(1.4),
				randomize(1.9),
				randomize(2.9),
				randomize(1.8),
				randomize(4.6),
				randomize(4.2),
			],
		},
		{
			name: 'Cash Flow',
			type: 'column',
			data: [
				randomize(3),
				randomize(2),
				randomize(3.1),
				randomize(5),
				randomize(3.1),
				randomize(3.9),
				randomize(3.5),
				randomize(5.5),
			],
		},
		{
			name: 'Revenue',
			type: 'line',
			data: [
				randomize(30),
				randomize(43),
				randomize(51),
				randomize(19),
				randomize(32),
				randomize(25),
				randomize(39),
				randomize(42),
			],
		},
	];

	const TOP_SELLER_FILTER = {
		DAY: 'day',
		WEEK: 'week',
		MONTH: 'month',
	};
	const [topSellerFilter, setTopSellerFilter] = useState(TOP_SELLER_FILTER.DAY);
	const filteredData = data
		.filter(
			(f) =>
				(topSellerFilter === TOP_SELLER_FILTER.DAY && f.id < 6) ||
				(topSellerFilter === TOP_SELLER_FILTER.WEEK && f.name.includes('c')) ||
				(topSellerFilter === TOP_SELLER_FILTER.MONTH && f.price > 13),
		)
		.filter((c, index) => index < 5);

	const [currentPage, setCurrentPage] = useState(1);
	const [perPage, setPerPage] = useState(PER_COUNT['3']);
	const { items, requestSort, getClassNamesFor } = useSortableData(filteredData);

	function compareLabel(amount = -1, name = false) {
		if (activeTab === TABS.YEARLY) {
			return name ? 'year' : moment().add(amount, 'year').format('YYYY');
		}
		if (activeTab === TABS.MONTHLY) {
			return name ? 'month' : moment().add(amount, 'month').format('MMMM');
		}
		return name ? 'week' : moment().add(amount, 'week').format('w [th week]');
	}

	const [tasks, setTasks] = useState([]);
	const [teams, setTeams] = useState([]);
	const [students, setStudents] = useState([]);

	const getTasks = async () => {
		const response = await axios.get('http://localhost:4000/task/view');
		console.log('GET TASK: ', response.data);
		setTasks(response.data);
	};

	const getTeams = async () => {
		const response = await axios.get('http://localhost:4000/team/view');
		console.log('GET TEAMS: ', response.data);
		setTeams(response.data);
	};

	const getStudents = async (id) => {
		const response = await axios.get('http://localhost:4000/student/getStudents');
		//console.log('GET TEAMS: ', response.data);
		setStudents(response.data);
		console.log('STUDENTS: ', response.data);
	};

	const deleteTeam = async (id) => {
		await axios.delete(`http://localhost:4000/team/${id}`, { id });
		getTeams()

	};


	return (
		<PageWrapper title={demoPages.sales.subMenu.dashboard.text}>
			<SubHeader>
				<SubHeaderLeft>
					<span className='h4 mb-0 fw-bold'>Dashboard</span>
					<SubheaderSeparator />
					<span className='h4 mb-0 fw-bold'>Welcome! Lets work togather</span>
				</SubHeaderLeft>
				<SubHeaderRight>
					<CommonAvatarTeam>
						<strong>Team</strong> Members
					</CommonAvatarTeam>
				</SubHeaderRight>
			</SubHeader>
			<Page container='fluid'>
				<div
					style={{
						overflowX: 'scroll',
						overflowY: 'hidden',
						whiteSpace: 'nowrap',
						WebkitOverflowScrolling: 'touch',
						position: 'relative',
					}}>
					{/* <div className='col-12'>
						<Alert
							icon='Verified'
							isLight
							color='primary'
							borderWidth={0}
							className='shadow-3d-primary'
							isDismissible>
							<AlertHeading tag='h2' className='h4'>
								Congratulations! 🎉
							</AlertHeading>
							<span>You have reached your monthly sales targets.</span>
						</Alert>
					</div> */}

					<div
						className='col-xl-4'
						style={{
							display: 'inline-block',
							zoom: 1,
							float: 'none',
							marginRight: 10,
						}}>
						<UserContact
							name={JSON.parse(localStorage.getItem('user')).Name}
							position={JSON.parse(localStorage.getItem('user')).Position}
							mail={`${USERS.SAM.username}@site.com`}
							phone='1234567'
							onChat={() =>
								navigate(`../${demoPages.chat.subMenu.withListChat.path}`)
							}
							src={USERS.SAM.src}
							srcSet={USERS.SAM.srcSet}
							color={USERS.SAM.color}
						/>
					</div>

					{teams.map((i, key) => (
						<div
							className='col-xl-4'
							style={{
								display: 'inline-block',
								zoom: 1,
								float: 'none',
								marginRight: 10,
							}}>
							<Card stretch>
								<CardHeader className='bg-transparent'>
									<CardLabel>
										<CardTitle tag='h4' className='h5'>
											{i.Name}
										</CardTitle>
										<CardSubTitle tag='h5' className='h6 text-muted'>
											{i.Meeting}
										</CardSubTitle>
									</CardLabel>
									<CardActions>
										<Button
											icon='ArrowForwardIos'
											aria-label='Read More'
											hoverShadow='default'
											color={darkModeStatus ? 'dark' : null}
											onClick={() => {}

											}
										/>
											<Button
											icon='Delete'
											aria-label='Read More'
											hoverShadow='default'
											color={darkModeStatus ? 'dark' : null}
											onClick={()=>{deleteTeam(i._id)}}
											
										/>
									</CardActions>
								</CardHeader>
								<CardBody>
									<h7>{i.Student==undefined?"Currently, no member is added":i.Student.length == 1?`${i.Student.length } Member`: `${i.Student.length } Members`}</h7>
								</CardBody>
							</Card>
						</div>
					))}
				</div>
				<div className='row'>
					<div className='col-xxl-6'>
						<Card stretch>
							<CardHeader>
								<CardLabel icon='NotificationsActive' iconColor='warning'>
									<CardTitle tag='h4' className='h5'>
										Recent Tasks
									</CardTitle>
									<CardSubTitle>last 2 weeks</CardSubTitle>
								</CardLabel>
							</CardHeader>
							<CardBody>
								<Timeline>
									{tasks.map((i, key) => (
										<TimelineItem
											label={new Date(i.end).toLocaleString('en-US', 

											{ year: 'numeric', month: 'long', day: 'numeric' }
											// {
											//  day: '2-digit',
											// 	 month: '2-digit',
											// 	// year: 'numeric',
											// 	// hour: '2-digit',
											// 	// minute: '2-digit',
											// 	// // second: '2-digit',
											// 	// hour12: true,
											// }
											
											)}
											color={getColorNameWithIndex(key)}>
											{i.title} - {i.Priority} - {i.AssignStudentName}
										</TimelineItem>
									))}
								</Timeline>
							</CardBody>
						</Card>
					</div>
					<div className='col-xxl-6'>
						<CommonTodo />
					</div>
				</div>
			</Page>
		</PageWrapper>
	);
};

export default DashboardPage;
