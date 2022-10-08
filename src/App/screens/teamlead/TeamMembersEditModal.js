import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useFormik } from 'formik';
import Modal, {
	ModalBody,
	ModalFooter,
	ModalHeader,
	ModalTitle,
} from '../../../components/bootstrap/Modal';
import showNotification from '../../../components/extras/showNotification';
import Icon from '../../../components/icon/Icon';
import FormGroup from '../../../components/bootstrap/forms/FormGroup';
import Input from '../../../components/bootstrap/forms/Input';

import Button from '../../../components/bootstrap/Button';
import Label from '../../../components/bootstrap/forms/Label';
import Checks, { ChecksGroup } from '../../../components/bootstrap/forms/Checks';
import PAYMENTS from '../../../common/data/enumPaymentMethod';
import Select from '../../../components/bootstrap/forms/Select';
import Option from '../../../components/bootstrap/Option';
import axios from 'axios';

const TeamMembersEditModal = ({ id, isOpen, setIsOpen }) => {
	// const itemData = id ? data.filter((item) => item.id.toString() === id.toString()) : {};
	// const item = id ? itemData[0] : {};

	const addToDatabase = async (val) => {
		console.log('AAGAYAHUM', val);

		const Name = val.title;
		const Student = val.members;
	

		await axios.put('http://localhost:3500/student/teamMember', {
			Name,
			Student,
			
		});
	};

	var [ use, setuse ] = useState([]);
	var [ selectedMembersID , setselectedMembersID ] = useState([]);
	var [selectedMembersName, setselectedMembersName] = useState([]);
	var [flipState, setflipState] = useState(false);

	useEffect(() => {
		const fetchData = async () => {
			const response = await axios.get('http://localhost:3500/student/getAllStudents');
			console.log('ssss', response.data);
			setuse(response.data);
			setselectedMembersID([])
			setselectedMembersName([])
		};

		// call the function
		fetchData();
	},[flipState,isOpen]);

	console.log('USERS: ', use);

	const formik = useFormik({
		initialValues: {
			title: '',
			members: '',
			
		},
		// eslint-disable-next-line no-unused-vars

		validateOnChange:false,
        validateOnBlur:false,
		onSubmit: (values) => {
			console.log("VALUES: ",values);
			addToDatabase(values);
			setflipState(!flipState);
			

			setIsOpen(false);
			showNotification(
				<span className='d-flex align-items-center'>
					<Icon icon='Info' size='lg' className='me-1' />
					<span>Team Assigned Successfully</span>
				</span>,
				'Team Member has been assigned the task successfully',
			);
		},
	});

	if (id || id === 0) {
		return (
			<Modal isOpen={isOpen} setIsOpen={setIsOpen} size='xl' titleId={id}>
				<ModalHeader setIsOpen={setIsOpen} className='p-4'>
					<ModalTitle id={id}>{'Assign Team'}</ModalTitle>
				</ModalHeader>
				<ModalBody className='px-4'>
					<div className='row g-4'>
						

						<FormGroup id='members' label='Choose Team Members' className='col-md-6'>
							<Select
								placeholder='Please choose ...'
								value={formik.values.members}
								onChange={(e) =>	{
									selectedMembersID.push(e.target.value);
									
									formik.setFieldValue('members', 	selectedMembersID);
									setselectedMembersID(selectedMembersID);
									
									

									//remove id from array function
									const selectedID = e.target.value;
									var markTrue = false
									const removeId = (selectedID) => {
										return use.filter((item) => {

											if (item._id !== selectedID){
												
												return item;
											}

											else if (markTrue==false) {
												selectedMembersName.push(item.Name);
												markTrue = true;
											}
									
										
										});
									}
									setselectedMembersName(selectedMembersName);
									
									setuse(removeId(selectedID))
									console.log('removeId: ',removeId(selectedID) );

								}}
								ariaLabel='Team member select'>
								{use.map((u, k) => (
									<Option key={k} value={u._id}>
										{`${u.Name}`}
									</Option>
								))}
							</Select>
						</FormGroup>

						<FormGroup  label='Selected Team Members'  className='col-md-6' >
						<br></br>
							{selectedMembersName.map((u, k) => (
								<Button style={{margin: '2px'}} className="btn-outline-primary" disable  key={k}>{u}</Button>
							))}
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
TeamMembersEditModal.propTypes = {
	id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
	isOpen: PropTypes.bool.isRequired,
	setIsOpen: PropTypes.func.isRequired,
};

export default TeamMembersEditModal;
