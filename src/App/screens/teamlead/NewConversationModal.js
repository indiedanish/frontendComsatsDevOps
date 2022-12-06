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
import Swal from "sweetalert2";
import { Cookies } from "react-cookie";
import jwt_decode from "jwt-decode";
axios.defaults.withCredentials = true;
const TeamMembersEditModal = ({ id, isOpen, setIsOpen, projectInfo, reload }) => {
	// const itemData = id ? data.filter((item) => item.id.toString() === id.toString()) : {};
	// const item = id ? itemData[0] : {};
	const [studentSelf, setstudentSelf] = useState([]);



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

		setstudentSelf(response.data);
		console.log("STUDENT himself: ", response.data);

	};


	const addToDatabase = async (val) => {
		console.log('AAGAYAHUM', val, projectInfo.Name);

		const Name = projectInfo.Name;
		const Student = val.members;


		await axios.put('http://localhost:3500/student/teamMember', {
			Name,
			Student,

		});


		Swal.fire({
			icon: 'success',
			title: 'Team Member Added',
			text: 'Team Member has been added successfully',

		})

		reload()
	};

	var [use, setuse] = useState([]);
	var [selectedMembersID, setselectedMembersID] = useState([]);
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
	}, [flipState, isOpen]);

	console.log('USERS: ', use);

	const formik = useFormik({
		initialValues: {
			title: '',
			members: '',

		},
		// eslint-disable-next-line no-unused-vars

		validateOnChange: false,
		validateOnBlur: false,
		onSubmit: (values) => {
			console.log("VALUES: ", values);
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

	const [selectedUser, setSelectedUser] = useState("Please Select");

	useEffect(() => {
		getstudentSelf()

	}, []);

	const createConversation = async () => {


		const response = await axios.post(
			"http://localhost:3500/chat/conversations/",
			{
				senderId: studentSelf._id,
				receiverId: selectedUser,


			},
			{
				withCredentials: true, //correct
			}
		);
		reload()
		setIsOpen(false);

	}

	if (id || id === 0) {
		return (
			<Modal isOpen={isOpen} setIsOpen={setIsOpen} size='xl' titleId={id}>
				<ModalHeader setIsOpen={setIsOpen} className='p-4'>
					<ModalTitle id={id}>{'Create Conversation'}</ModalTitle>
				</ModalHeader>
				<ModalBody className='px-4'>
					<div className='row g-4'>


						<FormGroup id='members' label='Choose Members' className='col-md-12'>
							<Select
								placeholder='Please choose ...'
								value={selectedUser}
								onChange={(e) => {
									setSelectedUser(e.target.value);





								}}
								ariaLabel='Team member select'>
								{use.map((u, k) => (
									<Option key={k} value={u._id}>
										{`${u.Name}`}
									</Option>
								))}
							</Select>
						</FormGroup>
					</div>
				</ModalBody>
				<ModalFooter className='px-4 pb-4'>
					<Button color='info' onClick={() => createConversation()}>
						Create
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
