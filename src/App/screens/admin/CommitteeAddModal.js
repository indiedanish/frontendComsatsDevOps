import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useFormik } from 'formik';
import moment from 'moment';
import Modal, {
	ModalBody,
	ModalFooter,
	ModalHeader,
	ModalTitle,
} from '../../../components/bootstrap/Modal';
import data from '../../../common/data/dummyCustomerData';
import showNotification from '../../../components/extras/showNotification';
import Icon from '../../../components/icon/Icon';
import FormGroup from '../../../components/bootstrap/forms/FormGroup';
import Input from '../../../components/bootstrap/forms/Input';
import Card, {
	CardBody,
	CardHeader,
	CardLabel,
	CardTitle,
} from '../../../components/bootstrap/Card';
import Button from '../../../components/bootstrap/Button';
import Label from '../../../components/bootstrap/forms/Label';
import Checks, { ChecksGroup } from '../../../components/bootstrap/forms/Checks';
import PAYMENTS from '../../../common/data/enumPaymentMethod';
import Select from '../../../components/bootstrap/forms/Select';
import Option from '../../../components/bootstrap/Option';
import axios from 'axios';
import Swal from "sweetalert2";
import SweetAlert from "react-bootstrap-sweetalert";


const CommitteeAddModal = ({ id, isOpen, setIsOpen }) => {
	// const itemData = id ? data.filter((item) => item.id.toString() === id.toString()) : {};
	// const item = id ? itemData[0] : {};


	var [allTeachers, setallTeachers] = useState([]);
	var [selectedTeachers, setselectedTeachers] = useState([]);
	var [teachersTempArray, setteachersTempArray] = useState([]);
	var [flipState, setflipState] = useState(false);
	const [countClick, setcountClick] = useState(0);
	const [hideAlert, sethideAlert] = useState(true)
	const [errorMessage, seterrorMessage] = useState({})

	const addToDatabase = async (val) => {
		console.log('AAGAYAHUM', val);

		const Name = val.title;
		const Teachers = val.selectedTeachers;


		try {

			await axios.post('http://localhost:4000/team/add', {
				Name,
				Teachers

			});
			Swal.fire('Assigned!', '', 'success')
			setIsOpen(false);
			showNotification(
				<span className='d-flex align-items-center'>
					<Icon icon='Info' size='lg' className='me-1' />
					<span>Committee Created Successfully</span>
				</span>,
				'Team Member has been assigned the task successfully',
			);

		}
		catch (err) {
			console.log(err)
			sethideAlert(false)
			seterrorMessage({ title: err.message, message: "Please try again laterr= after some time" })
		}




	};


	useEffect(() => {
		const fetchData = async () => {

			const response = await axios.get("http://localhost:3500/admin/getAllTeachers",
				{
					withCredentials: true,
				});

			setallTeachers(response.data);


			setselectedTeachers([])
			setteachersTempArray([])
		};

		// call the function
		fetchData();
	}, [flipState, isOpen]);

	console.log('allTeachers: ', allTeachers);
	console.log('teachersTempArray', teachersTempArray)

	const formik = useFormik({
		initialValues: {
			title: '',

			teachers: '',

		},
		// eslint-disable-next-line no-unused-vars

		validateOnChange: false,
		validateOnBlur: false,
		onSubmit: (values) => {
			console.log("VALUES on Submit: ", values);
			if (values.title == "") { sethideAlert(false); seterrorMessage({ title: "Committee name empty", message: "You have'nt entered committee name" }) }

			else if (countClick <= 0) { sethideAlert(false); seterrorMessage({ title: "Teachers not selected", message: "You have'nt selected any teacher" }) }

			else {

				addToDatabase(values);
				setflipState(!flipState);
			}



		},
	});



	if (id || id === 0) {
		return (
			<Modal isOpen={isOpen} setIsOpen={setIsOpen} size='xl' titleId={id}>
				<ModalHeader setIsOpen={setIsOpen} className='p-4'>
					<ModalTitle id={id}>{'Assign Committee'}</ModalTitle>
				</ModalHeader>
				<ModalBody className='px-4'>
					<div className='row g-4'>
						<FormGroup id='title' label='Committee Name' className='col-md-6'>
							<Input required onChange={formik.handleChange} value={formik.values.title} />
						</FormGroup>




						<FormGroup id='teachers' label='Choose Teachers:' className='col-md-6'>
							<Select
								placeholder='Please choose ...'
								value={formik.values.teachers}
								onChange={(e) => {

									setcountClick(countClick + 1);

									if (countClick < 3) {
										selectedTeachers.push(e.target.value);

										formik.setFieldValue('selectedTeachers', selectedTeachers);
										setselectedTeachers(selectedTeachers);

										const selectedID = e.target.value;
										var markTrue = false
										const removeId = (selectedID) => {
											return allTeachers.filter((item) => {

												if (item._id !== selectedID) {

													return item;
												}

												else if (markTrue == false) {
													teachersTempArray.push(item);
													markTrue = true;
												}


											});
										}
										setteachersTempArray(teachersTempArray);

										setallTeachers(removeId(selectedID))
										console.log('removeId: ', removeId(selectedID));
									}
									else {
										sethideAlert(false)
										seterrorMessage({ title: "Max Limit Execded", message: "You can select only 3 teachers" })
										return
									}
								}}
								ariaLabel='Team member select'>
								{allTeachers.map((u, k) => (
									<Option key={k} value={u._id}   >
										{`${u.Name}`}
									</Option>
								))}
							</Select>
						</FormGroup>

						<FormGroup label='Selected Teachers' className='col-md-6' >
							<br></br>
							{teachersTempArray.map((u, k) => (
								<>
									<Button style={{ margin: '2px' }}
										// <Icon  icon="Close"  key={k}/> 

										className="btn-outline-primary" key={k}
									>{u.Name}</Button>



								</>
							))}
							{countClick == 0 ? "" : <Button style={{ color: '#bb0b0b', border: '3px', }} onClick={
								() => {
									setcountClick(0);


									const temp = allTeachers.concat(teachersTempArray);
									setallTeachers(temp);
									setteachersTempArray([]);
									setselectedTeachers([])
								}
							} >Clear <Icon icon="Close" /></Button>}

							{
								hideAlert == false ? <SweetAlert
									error
									title={errorMessage.title}
									onConfirm={() => sethideAlert(true)}
								>
									{errorMessage.message}
								</SweetAlert> : ""
							}

							{
								hideAlert == false ? <SweetAlert
									error
									title={errorMessage.title}
									onConfirm={() => sethideAlert(true)}
								>
									{errorMessage.message}
								</SweetAlert> : ""
							}


						</FormGroup>




					</div>
				</ModalBody>
				<ModalFooter className='px-4 pb-4'>
					<Button color='info' onClick={formik.handleSubmit}>
						Assign
					</Button>
				</ModalFooter>
			</Modal>
		);
	}
	return null;
};
CommitteeAddModal.propTypes = {
	id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
	isOpen: PropTypes.bool.isRequired,
	setIsOpen: PropTypes.func.isRequired,
};

export default CommitteeAddModal;
