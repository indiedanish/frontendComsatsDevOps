import React, { useEffect, useState } from "react";
import moment from "moment";
import classNames from "classnames";
import { Calendar, momentLocalizer, Views } from "react-big-calendar";
import { useFormik } from "formik";
import { Calendar as DatePicker } from "react-date-range";
import SubHeader, {
	SubHeaderLeft,
	SubHeaderRight,
} from "../../../layout/SubHeader/SubHeader";

import Page from "../../../layout/Page/Page";
import PageWrapper from "../../../layout/PageWrapper/PageWrapper";
import Icon from "../../../components/icon/Icon";
import Button from "../../../components/bootstrap/Button";
import Card, {
	CardActions,
	CardBody,
	CardHeader,
	CardLabel,
	CardTitle,
} from "../../../components/bootstrap/Card";
import eventList from "../../../common/data/events";
import OffCanvas, {
	OffCanvasBody,
	OffCanvasHeader,
	OffCanvasTitle,
} from "../../../components/bootstrap/OffCanvas";
import FormGroup from "../../../components/bootstrap/forms/FormGroup";
import Input from "../../../components/bootstrap/forms/Input";
import Select from "../../../components/bootstrap/forms/Select";
import USERS, {
	getUserDataWithUsername,
} from "../../../common/data/userDummyData";
import Avatar, { AvatarGroup } from "../../../components/Avatar";
import useMinimizeAside from "../../../hooks/useMinimizeAside";
import Popovers from "../../../components/bootstrap/Popovers";
import {
	CalendarTodayButton,
	CalendarViewModeButtons,
	getLabel,
	getUnitType,
	getViews,
} from "../../../components/extras/calendarHelper";
import { demoPages } from "../../../menu";
import SERVICES, {
	getServiceDataWithServiceName,
} from "../../../common/data/serviceDummyData";
import Option from "../../../components/bootstrap/Option";

import useDarkMode from "../../../hooks/useDarkMode";
import useAuth from "../../../hooks/useAuth";
import axios from "axios";
axios.defaults.withCredentials = true;
import { Grid, Radio } from "react-loader-spinner";
const localizer = momentLocalizer(moment);
const now = new Date();

const MyEvent = (data) => {
	const { darkModeStatus } = useDarkMode();

	const { event } = data;
	return (
		<div className="row g-2">
			<div className="col text-truncate">
				{/* {event?.icon && <Icon icon={event?.icon} size='lg' className='me-2' />} */}
				{event?.Title}
				{" - "}
			</div>
			{/* {event?.user?.src && (
				<div className='col-auto'>
					<div className='row g-1 align-items-baseline'>
						<div className='col-auto'>
							<Avatar src={event?.user?.src} srcSet={event?.user?.srcSet} size={18} />
						</div>
						<small
							className={classNames('col-auto text-truncate', {
								'text-dark': !darkModeStatus,
								'text-white': darkModeStatus,
							})}>
							{event?.user?.name}
						</small>
					</div>
				</div>
			)}
			{event?.users && (
				<div className='col-auto'>
					<AvatarGroup size={18}>
						{event.users.map((user) => (
							// eslint-disable-next-line react/jsx-props-no-spreading
							<Avatar key={user.src} {...user} />
						))}
					</AvatarGroup>
				</div>
			)} */}
		</div>
	);
};

const MyWeekEvent = (data) => {
	const { darkModeStatus } = useDarkMode();
	console.log("VERY USEFUL", data);
	const { event } = data;
	return (
		<div className="row g-2">
			<div className="col-12 text-truncate">
				{event?.icon && <Icon icon={event?.icon} size="lg" className="me-2" />}
				{event?.name}
			</div>
			{event?.user && (
				<div className="col-12">
					<div className="row g-1 align-items-baseline">
						<div className="col-auto">
							{/* eslint-disable-next-line react/jsx-props-no-spreading */}
							<Avatar {...event?.user} size={18} />
						</div>
						<small
							className={classNames("col-auto text-truncate", {
								"text-dark": !darkModeStatus,
								"text-white": darkModeStatus,
							})}
						>
							{event?.user?.name}
						</small>
					</div>
				</div>
			)}
			{event?.users && (
				<div className="col-12">
					<AvatarGroup size={18}>
						{event.users.map((user) => (
							// eslint-disable-next-line react/jsx-props-no-spreading
							<Avatar key={user.src} {...user} />
						))}
					</AvatarGroup>
				</div>
			)}
		</div>
	);
};

const Sprint = ({ reload }) => {
	const { darkModeStatus, themeStatus } = useDarkMode();

	const [toggleRightPanel, setToggleRightPanel] = useState(true);
	const { auth, setAuth } = useAuth();
	const [studentSelf, setstudentSelf] = useState(null);

	// BEGIN :: Calendar
	// Active employee
	const [employeeList, setEmployeeList] = useState({
		[USERS.CHLOE.username]: true,

		[USERS.RYAN.username]: true,
		[USERS.GRACE.username]: true,
	});
	// Events
	const [events, setEvents] = useState(eventList);

	// FOR DEV
	useEffect(() => {
		setEvents(eventList);
		return () => { };
	}, []);

	// Selected Event
	const [eventItem, setEventItem] = useState(null);
	// Calendar View Mode
	const [viewMode, setViewMode] = useState(Views.MONTH);
	// Calendar Date
	const [date, setDate] = useState(new Date());
	// Item edit panel status
	const [toggleInfoEventCanvas, setToggleInfoEventCanvas] = useState(false);
	const setInfoEvent = () => setToggleInfoEventCanvas(!toggleInfoEventCanvas);
	const [eventAdding, setEventAdding] = useState(false);

	// Calendar Unit Type
	const unitType = getUnitType(viewMode);
	// Calendar Date Label
	const calendarDateLabel = getLabel(date, viewMode);

	// Change view mode
	const handleViewMode = (e) => {
		setDate(moment(e)._d);
		setViewMode(Views.DAY);
	};
	// View modes; Month, Week, Work Week, Day and Agenda
	const views = getViews();

	// New Event
	const handleSelect = ({ start, end }) => {
		setEventAdding(true);
		setEventItem({ start, end });
	};

	useEffect(() => {
		if (eventAdding) {
			setInfoEvent();
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [eventAdding]);

	/**
	 * Calendar Item Container Style
	 * @param event
	 * @param start
	 * @param end
	 * @param isSelected
	 * @returns {{className: string}}
	 */
	// eslint-disable-next-line no-unused-vars
	const eventStyleGetter = (event, start, end, isSelected) => {
		const getColorForStatus = (Priority) => {
			switch (Priority) {
				case "Medium":
					return "success";

				case "High":
					return "danger";
				case "Low":
					return "warning";

				default:
					return "primary";
				// code block
			}
		};

		const isActiveEvent = start <= now && end >= now;
		const isPastEvent = end < now;
		const color = getColorForStatus(event.Priority);

		return {
			className: classNames({
				[`bg-l${darkModeStatus ? "o25" : "10"}-${color} text-${color}`]: color,
				"border border-success": isActiveEvent,
				"opacity-50": isPastEvent,
			}),
		};
	};
	const addToDatabase = async (val) => {




		const title = val.title;
		const Priority = val.Priority;
		const Assign = val.teammember;
		const start = val.start;
		const end = val.end;
		const type = val.type
		console.log("val", title, Priority, Assign, start);
		var res = await axios.post("http://localhost:3500/student/requirement", {
			Title: title,
			AssignedTo: Assign,
			ProjectName: projectInfo.Name,
			Type: type,
			Priority: Priority,
			start: start,
			end: end,
		})

		console.log("res", res)

		getstudentSelf()



	};

	const formik = useFormik({
		initialValues: {
			title: "",
			teammember: "",
			start: Date.now(),
			end: Date.now(),
		},
		onSubmit: (values) => {
			addToDatabase(values);

			if (eventAdding) {
				setEvents((prevEvents) => [
					...prevEvents,
					{
						id: values.start,
						...getServiceDataWithServiceName(values.eventName),
						end: values.end,
						start: values.start,
						user: { ...getUserDataWithUsername(values.eventEmployee) },
					},
				]);
			}
			setToggleInfoEventCanvas(false);
			setEventAdding(false);
			setEventItem(null);
			formik.setValues({});
		},
	});

	const [tasks, setTasks] = useState([]);
	const [teammember, setTeammember] = useState([{ RegNo: "Loading..." }]);
	const [projectInfo, setprojectInfo] = useState([]);

	const [totalHighPriorityTask, setTotalHighPriorityTask] = useState(0);
	const [totalMediumPriorityTask, setTotalMediumPriorityTask] = useState(0);
	const [totalLowPriorityTask, setTotalLowPriorityTask] = useState(0);

	const calculateTasksPriority = () => {
		tasks.map((i) => {
			console.log(i.Priority);
			if (i.Priority == "High") {
				setTotalHighPriorityTask(6);
				console.log("getting: ", i.Priority, totalHighPriorityTask);
			} else if (i.Priority == "Medium") {
				setTotalMediumPriorityTask(totalMediumPriorityTask + 1);
			} else if (i.Priority == "Low") {
				setTotalLowPriorityTask(totalLowPriorityTask + 1);
			}

			return;
		});

		console.log(
			"CALCULATE",
			totalHighPriorityTask,
			totalMediumPriorityTask,
			totalLowPriorityTask
		);
	};

	useEffect(() => {
		var highcount = 0;
		var midcount = 0;
		var lowcount = 0;

		tasks.map((i) => {
			console.log(i.Priority);
			if (i.Priority == "High") {
				highcount++;
				console.log("TTT: ", highcount);
			} else if (i.Priority == "Medium") {
				midcount++;
			} else if (i.Priority == "Low") {
				lowcount++;
			}

			return;
		});
		setTotalHighPriorityTask(highcount);
		setTotalMediumPriorityTask(midcount);
		setTotalLowPriorityTask(lowcount);
	}, [tasks]);

	const getProject = async (res) => {
		const response = await axios.post(
			"http://localhost:3500/student/project",
			{ Name: res.data.Project.Name },
			{
				withCredentials: true, //correct
			}
		);
		// setsingleProject(response);
		console.log("ProjectDetails: ", response.data);

		setprojectInfo(response.data)

		setTeammember(response.data.GroupMembers)
	};

	const getstudentSelf = async () => {
		console.log("MY REGNO: ", auth.RegNo);

		const response = await axios.post(
			"http://localhost:3500/student/getStudent",
			{ RegNo: auth.RegNo },
			{
				withCredentials: true, //correct
			}
		);

		setstudentSelf(response);
		console.log("res.data : ", response.data);
		setTasks(response.data.Project.Requirements);
		getProject(response);

		console.log("IMLATEE");
	};

	const fetchData = async () => {
		const response = await axios.get(
			"http://localhost:4000/student/getStudents"
		);
		console.log("Team Members: ", response.data);

	};

	useEffect(() => {
		fetchData();
		getstudentSelf();

		if (eventItem)
			formik.setValues({
				...formik.values,
				eventId: eventItem.id || null,
				eventName: eventItem.name,
				start: moment(eventItem.start).format(),
				end: moment(eventItem.end).format(),
				eventEmployee: eventItem?.user?.username,
			});
		return () => { };
		//	eslint-disable-next-line react-hooks/exhaustive-deps
	}, [eventItem]);
	// END:: Calendar

	const [toggleCalendar, setToggleCalendar] = useState(true);

	return (
		<>
			{!projectInfo?.Name ? (
				<div className="w- flex flex-col  h-[700px] justify-center items-center">
					<Radio
						height="150"
						width="150"
						color="#6C5DD3"
						ariaLabel="grid-loading"
						radius="12.5"
						wrapperStyle={{}}
						wrapperClass=""
						visible={true}
					/>
					<h4 className="mt-5">Check if you are added to any group</h4>


				</div>
			) : (
				<PageWrapper title={demoPages.appointment.subMenu.dashboard.text}>
					<SubHeader>
						<SubHeaderLeft>
							<Button color={"danger"} isLight>
								High: {totalHighPriorityTask}
							</Button>
							<Button color={"success"} isLight>
								Medium: {totalMediumPriorityTask}
							</Button>
							<Button color={"warning"} isLight>
								Low: {totalLowPriorityTask}
							</Button>
						</SubHeaderLeft>
						<SubHeaderRight>
							{/* <Button
						icon='Groups'
						onClick={() => setToggleRightPanel(!toggleRightPanel)}
						color={toggleRightPanel ? 'dark' : 'light'}
						aria-label='Toggle right panel'
					/> */}
							<Button
								icon="AreaChart"
								onClick={() => setToggleCalendar(!toggleCalendar)}
								color={toggleCalendar ? "dark" : "light"}
								aria-label="Toggle calendar & charts"
							/>
							<Popovers
								desc={
									<DatePicker
										onChange={(item) => setDate(item)}
										date={date}
										color={process.env.REACT_APP_PRIMARY_COLOR}
									/>
								}
								placement="bottom-end"
								className="mw-100"
								trigger="click"
							>
								<Button color={darkModeStatus ? "light" : "dark"} isLight>
									{calendarDateLabel}
								</Button>
							</Popovers>
						</SubHeaderRight>
					</SubHeader>
					<Page container="fluid">
						{toggleCalendar && (
							<>
								<div className="row h-100">
									<div
										className={classNames({
											"col-xxl-8": !toggleRightPanel,
											"col-12": toggleRightPanel,
										})}
									>
										<Card stretch style={{ minHeight: 680 }}>
											<CardHeader>
												<CardActions>
													<CalendarTodayButton
														unitType={unitType}
														date={date}
														setDate={setDate}
														viewMode={viewMode}
													/>
												</CardActions>
												<CardActions>
													<CalendarViewModeButtons
														setViewMode={setViewMode}
														viewMode={viewMode}
													/>
												</CardActions>
											</CardHeader>
											<CardBody isScrollable>
												<Calendar
													showAllEvents={true}
													selectable
													toolbar={false}
													localizer={localizer}
													// events={events.filter(
													// (i) =>{

													// 	return employeeList[i.user?.username]}
													// )}

													events={tasks}
													defaultView={Views.WEEK}
													views={views}
													view={viewMode}
													date={date}
													onNavigate={(_date) => setDate(_date)}
													scrollToTime={new Date(1970, 1, 1, 6)}
													defaultDate={new Date()}
													onSelectEvent={(event) => {
														setInfoEvent();
														setEventItem(event);
													}}
													onSelectSlot={handleSelect}
													onView={handleViewMode}
													onDrillDown={handleViewMode}
													components={{
														event: MyEvent, // used by each view (Month, Day, Week)
														week: {
															event: MyWeekEvent,
														},
														work_week: {
															event: MyWeekEvent,
														},
													}}
													eventPropGetter={eventStyleGetter}
												/>
											</CardBody>
										</Card>
									</div>
									<div
										className={classNames({
											"col-xxl-4": !toggleRightPanel,
											"col-12": toggleRightPanel,
										})}
									>
										<div className="row">
											<div
												className={classNames(
													{
														"col-xxl-12": !toggleRightPanel,
													},
													"col-md-6"
												)}
											></div>
										</div>
									</div>
								</div>
							</>
						)}

						<OffCanvas
							setOpen={(status) => {
								setToggleInfoEventCanvas(status);
								setEventAdding(status);
							}}
							isOpen={toggleInfoEventCanvas}
							titleId="canvas-title"
						>
							<OffCanvasHeader
								setOpen={(status) => {
									setToggleInfoEventCanvas(status);
									setEventAdding(status);
								}}
								className="p-4"
							>
								<OffCanvasTitle id="canvas-title">Add Task</OffCanvasTitle>
							</OffCanvasHeader>
							<OffCanvasBody
								tag="form"
								onSubmit={formik.handleSubmit}
								className="p-4"
							>
								<div className="row g-4">
									{/* Name */}
									<div className="col-12">
										<FormGroup id="title" label="Task" className="col-md">
											<Input
												onChange={formik.handleChange}
												value={formik.values.task}
											/>
										</FormGroup>
									</div>

									<div className="col-12">
										<FormGroup
											id="type"
											label="Type"
											className="col-md"
										>
											<Select
												placeholder="Select Type..."
												value={formik.values.type}
												onChange={formik.handleChange}
												ariaLabel="Type select"
											>
												<Option value="Design">Design</Option>
												<Option value="Development">Development</Option>
												<Option value="Testing">Testing</Option>
												<Option value="Debugging">Debugging</Option>

											</Select>
										</FormGroup>
									</div>

									<div className="col-12">
										<FormGroup
											id="Priority"
											label="Priority"
											className="col-md"
										>
											<Select
												placeholder="Select Priority..."
												value={formik.values.priority}
												onChange={formik.handleChange}
												ariaLabel="Team member select"
											>
												<Option value="Low">Low</Option>
												<Option value="Medium">Medium</Option>
												<Option value="High">High</Option>
											</Select>
										</FormGroup>
									</div>

									{/* Date */}
									<div className="col-12">
										<Card className="mb-0 bg-l10-info" shadow="sm">
											<CardHeader className="bg-l25-info">
												<CardLabel icon="DateRange" iconColor="info">
													<CardTitle className="text-info">
														Select Date
													</CardTitle>
												</CardLabel>
											</CardHeader>
											<CardBody>
												<div className="row g-3">
													<div className="col-12">
														<FormGroup id="start" label="Start Date">
															<Input
																type="datetime-local"
																value={moment(formik.values.start).format(
																	moment.HTML5_FMT.DATETIME_LOCAL
																)}
																onChange={formik.handleChange}
															/>
														</FormGroup>
													</div>

													<div className="col-12">
														<FormGroup id="end" label="End Date">
															<Input
																type="datetime-local"
																value={moment(formik.values.end).format(
																	moment.HTML5_FMT.DATETIME_LOCAL
																)}
																onChange={formik.handleChange}
															/>
														</FormGroup>
													</div>
												</div>
											</CardBody>
										</Card>
									</div>
									{/* Task */}
									<div className="col-12">
										<Card className="mb-0 bg-l10-dark" shadow="sm">
											<CardHeader className="bg-l25-dark">
												<CardLabel icon="Person Add" iconColor="dark">
													<CardTitle>Select Team Member</CardTitle>
												</CardLabel>
											</CardHeader>
											<CardBody>
												<FormGroup
													id="teammember"
													label="Select Team Member"
													className="col-md"
												>
													<Select
														placeholder="Please select..."
														value={formik.values.teammember}
														onChange={formik.handleChange}
														ariaLabel="Team member select"
													>
														{teammember.map((u, k) => (
															<Option key={k} value={u._id}>
																{`${u.RegNo}`}
															</Option>
														))}
													</Select>


												</FormGroup>
											</CardBody>
										</Card>
									</div>
									<div className="col" style={{ textAlign: "center" }}>
										<Button color="info" type="submit">
											Add Task
										</Button>
									</div>
								</div>
							</OffCanvasBody>
						</OffCanvas>

						{/* <CommonRightPanel setOpen={setToggleRightPanel} isOpen={toggleRightPanel} /> */}
					</Page>
				</PageWrapper>
			)}
		</>
	);
};

export default Sprint;
