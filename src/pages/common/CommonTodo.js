import React, { useState, useEffect } from 'react';
import { Calendar as DatePicker } from 'react-date-range';
import moment from 'moment';
import { useFormik } from 'formik';
import Card, {
	CardActions,
	CardBody,
	CardHeader,
	CardLabel,
	CardSubTitle,
	CardTitle,
} from '../../components/bootstrap/Card';
import Button from '../../components/bootstrap/Button';
import Modal, { ModalBody, ModalHeader, ModalTitle } from '../../components/bootstrap/Modal';
import FormGroup from '../../components/bootstrap/forms/FormGroup';
import Input from '../../components/bootstrap/forms/Input';
import Todo from '../../components/extras/Todo';
import Label from '../../components/bootstrap/forms/Label';
import Checks, { ChecksGroup } from '../../components/bootstrap/forms/Checks';
import Badge from '../../components/bootstrap/Badge';
import Progress from '../../components/bootstrap/Progress';
import axios from 'axios';
import Select from '../../components/bootstrap/forms/Select';
import Option from '../../components/bootstrap/Option';

const CommonTodo = () => {
	const TODO_BADGES = {
		PASS: { text: 'Pass', color: 'success' },
		FAIL: { text: 'Fail', color: 'danger' },
		REVIEW: { text: 'Review', color: 'info' },
		TEST: { text: 'Test', color: 'warning' },

		DEBUG: { text: 'Debug', color: 'info' },

		COMPLETED: { text: 'Completed', color: 'primary' },
		// MEETING: { text: 'Meeting', color: 'secondary' },
	};
	const getBadgeWithText = (text) => {
		return TODO_BADGES[Object.keys(TODO_BADGES).filter((f) => TODO_BADGES[f].text === text)];
	};

	/**
	 * To/Do List
	 */
	const [list, setList] = useState([
		{
			id: 1,
			status: true,
			title: 'New Products will be added',
			date: moment().add(0.5, 'day'),
			badge: TODO_BADGES.NEW,
		},
		{
			id: 2,
			status: true,
			title: 'Cover images will be edited',
			date: moment().add(2, 'day'),
			badge: TODO_BADGES.UPDATE,
		},
		{
			id: 3,
			status: false,
			title: 'Preparing for A/B testing',
			date: moment().add(2, 'day'),
			badge: TODO_BADGES.TEST,
		},
		{
			id: 4,
			status: false,
			title: 'Google Analytics data will be examined',
			date: moment().add(4, 'day'),
			badge: TODO_BADGES.REPORT,
		},
		{
			id: 5,
			status: false,
			title: 'Invoices will be issued',
			date: moment().add(9, 'day'),
			badge: TODO_BADGES.PRINT,
		},
		{
			id: 6,
			status: false,
			title: 'Dependencies check and update',
			date: moment().add(15, 'day'),
			badge: TODO_BADGES.CONTROL,
		},
		{
			id: 7,
			status: false,
			title: 'End of month meeting',
			date: moment().add(32, 'day'),
			badge: TODO_BADGES.MEETING,
		},
	]);
	
	
	const [listLength, setListLength] = useState(6);
	const [completeTaskLength, setcompleteTaskLength] = useState(4)
	


	/**
	 * Add New Modal Status
	 */
	const [modalStatus, setModalStatus] = useState(false);

	/**
	 * Ann New To/Do func
	 * @param title
	 * @param date
	 * @param badge
	 */
	const addTodo = (title, date, badge) => {
		const newTodos = [{ title, date, badge }, ...use];
		setuse(newTodos);
	};

	/**
	 * New To/Do Day
	 */
	const [date, setDate] = useState(new Date());

	const validate = (values) => {
		const errors = {};
		if (!values.testTitle) {
			errors.testTitle = 'Required';
		} else if (values.testTitle.length > 40) {
			errors.testTitle = 'Must be 40 characters or less';
		}

		return errors;
	};

	// const item = id ? itemData[0] : {};

	const addToDatabase = async (val) => {
		console.log('AAGAYAHUM', val);

		const Title = val.testTitle;
		const Status = val.testStatus;
		const Assign = val.teammember;
		const DeadlineDate = val.dueDate;

		await axios.post('http://localhost:4000/test/add', {
			Title,
			Assign,
			Status,
			DeadlineDate
			
		
		});
	};

	var [use, setuse] = useState([]);
	var [teammembers, setTeamMember] = useState([])
	const [studentSelf, setstudentSelf] = useState(null);
	const [projectInfo, setprojectInfo] = useState(null);
	useEffect(() => {
		const fetchData = async () => {
			const response = await axios.get('http://localhost:4000/test/view');
			console.log('All TASKKS', response.data);
			setuse(response.data);
			const listLength = list.length;
			//const completeTaskLength = list.filter((i) => i.status).length;
			setListLength(response.data.length)
			setcompleteTaskLength(response.data.filter((i) => i.status).length);
		};
		const fetchDataOfStudent = async () => {
			const response = await axios.get('http://localhost:4000/student/getStudents');
			console.log('ssss', response.data);
			setTeamMember(response.data);
		};

		// call the function
		fetchDataOfStudent();

		fetchData();
	
		// call the function
	
	}, []);

	console.log('DEKHO: ', use);
	const formik = useFormik({
		initialValues: {
			testTitle: '',

			testStatus: '',
			teammember: '',
			dueDate: date,
		},
		validate,
		onSubmit: (values, { resetForm }) => {
			addTodo(values.testTitle, date, getBadgeWithText(values.testStatus), teammember);
			console.log('we goott itt', values);
			addToDatabase(values);

			setModalStatus(false);
			resetForm({ values: '' });
		},
	});

	return (
		<Card stretch>
			<CardHeader>
				<CardLabel icon='AssignmentTurnedIn' iconColor='danger'>
					<CardTitle tag='h4' className='h5'>
						Testing Updates
					</CardTitle>
					<CardSubTitle>
						<Progress
							height={8}
							max={listLength}
							value={projectInfo}
							color={completeTaskLength === listLength ? 'success' : 'primary'}
						/>
					</CardSubTitle>
				</CardLabel>
				<CardActions>
					<Button
						color='info'
						icon='Add'
						isLight
						onClick={() => setModalStatus(!modalStatus)}>
						New
					</Button>
					<Modal setIsOpen={setModalStatus} isOpen={modalStatus} titleId='new-todo-modal'>
						<ModalHeader setIsOpen={setModalStatus}>
							<ModalTitle id='new-todo-modal'>New Test</ModalTitle>
						</ModalHeader>
						<ModalBody>
							<form className='row g-3' onSubmit={formik.handleSubmit}>
								<div className='col-12'>
									<FormGroup id='testTitle' label='Title'>
										<Input
											onChange={formik.handleChange}
											onBlur={formik.handleBlur}
											isValid={formik.isValid}
											isTouched={formik.touched.testTitle}
											invalidFeedback={formik.errors.testTitle}
											validFeedback='Looks good!'
											value={formik.values.testTitle}
										/>
									</FormGroup>
								</div>
								<div className='col-12'>
									<div>
										<Label>Due Date</Label>
									</div>
									<div className='text-center mt-n4'>
										{/* <DatePicker
											onChange={formik.handleChange}
											date={formik.values.dueDate}
											minDate={new Date()}
											color={process.env.REACT_APP_PRIMARY_COLOR}
										/> */}

										<DatePicker
											onChange={(item) => setDate(item)}
											date={date}
											minDate={new Date()}
											color={process.env.REACT_APP_PRIMARY_COLOR}
										/>


								
									</div>
								</div>
								<div className='col-12'>
									<FormGroup>
										<Label>Status</Label>
										<ChecksGroup isInline>
											{Object.keys(TODO_BADGES).map((i) => (
												<Checks
													key={TODO_BADGES[i].text}
													type='radio'
													name='testStatus'
													id={TODO_BADGES[i].text}
													label={
														<Badge isLight color={TODO_BADGES[i].color}>
															{TODO_BADGES[i].text}
														</Badge>
													}
													value={TODO_BADGES[i].text}
													onChange={formik.handleChange}
													checked={formik.values.testStatus}
												/>
											))}
										</ChecksGroup>
									</FormGroup>

									
								</div>

								<div className='col-12'>
									<FormGroup
										id='teammember'
										label='Select Team Member'
										className='col-md-6'>
										<Select
											placeholder='Please select...'
											value={formik.values.teammember}
											onChange={formik.handleChange}
											ariaLabel='Team member select'>
											{teammembers.map((u, k) => (
												<Option key={k} value={u._id}>
													{`${u.Name}`}
												</Option>
											))}
										</Select>
									</FormGroup>
								</div>
								<div className='col' />
								<div className='col-auto'>
									<Button
										type='submit'
										color='info'
										isLight
										isDisable={!formik.isValid && !!formik.submitCount}>
										Add Test
									</Button>
								</div>
							</form>
						</ModalBody>
					</Modal>
				</CardActions>
			</CardHeader>
			<CardBody isScrollable>
				<Todo list={projectInfo.Requirements} setList={setuse} />
			</CardBody>
		</Card>
	);
};

export default CommonTodo;
