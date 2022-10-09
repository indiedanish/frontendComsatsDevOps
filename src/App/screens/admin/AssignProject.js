import React, { useState, useEffect } from "react";
import { useFormik } from "formik";
import PageWrapper from "../../../layout/PageWrapper/PageWrapper";
import SubHeader, {
	SubHeaderLeft,
	SubHeaderRight,
	SubheaderSeparator,
} from "../../../layout/SubHeader/SubHeader";
import Page from "../../../layout/Page/Page";
import { adminMenu } from "../../../menu";

import { getFirstLetter, priceFormat } from "../../../helpers/helpers";

import PaginationButtons, {
	dataPagination,
	PER_COUNT,
} from "../../../components/PaginationButtons";

import Icon from "../../../components/icon/Icon";

import Dropdown, {
	DropdownItem,
	DropdownMenu,
	DropdownToggle,
} from "../../../components/bootstrap/Dropdown";

import useSortableData from "../../../hooks/useSortableData";

import { getColorNameWithIndex } from "../../../common/data/enumColors";
import useDarkMode from "../../../hooks/useDarkMode";
import axios from "axios";
import { Cookies } from "react-cookie";
import jwt_decode from "jwt-decode";
axios.defaults.withCredentials = true;

//////////////////////

import Card, {
	CardBody,

} from '../../../components/bootstrap/Card';
import Input from '../../../components/bootstrap/forms/Input';
;
import Button from '../../../components/bootstrap/Button';
import AssignProjectAddModal from './AssignProjectAddModal'
import Swal from "sweetalert2";
/////////////////////////////




const AssignProject = () => {

	const { darkModeStatus } = useDarkMode();

	const [currentPage, setCurrentPage] = useState(1);
	const [perPage, setPerPage] = useState(PER_COUNT["10"]);

	const [AllAssigned, setAllAssigned] = useState([])

	const [studentSelf, setstudentSelf] = useState([]);

	const [groupMembers, setGroupMembers] = useState([]);

	const getAllAssignProject = async () => {

		const res = await axios.get("http://localhost:3500/admin/getAssignedProject",
			{
				withCredentials: true,
			});
		setAllAssigned(res.data)
		console.log("WE ARE COMMIITTEES", res.data)



	}






	useEffect(() => {
		getAllAssignProject()
	}, []);

	const formik = useFormik({
		initialValues: {
			searchInput: "",
		},
		// eslint-disable-next-line no-unused-vars
		onSubmit: (values) => { },
	});

	const [refresh, setRefresh] = useState(false);

	const filteredData = AllAssigned.filter((f, key) =>
		f.Committee.toLowerCase().includes(formik.values.searchInput.toLowerCase())
	);

	

	const { items, requestSort, getClassNamesFor } = useSortableData(
		filteredData
	);

	
	const [editModalStatus, setEditModalStatus] = useState(false);
	const [addModalStatus, setAddModalStatus] = useState(false);
	const [studentInfo, setStudentInfo] = useState("")

	const Delete = async (Committee, Project) => {

		try {
			await axios.put(`http://localhost:3500/admin/deleteProjectCommittee`, { CommitteeName: Committee, ProjectName: Project  },
				{ withCredentials: true });



		} catch (error) {
			console.log(error);
		}

		getAllAssignProject()
	};

	const reload = () => {
		getAllAssignProject()
	}

	return (
		<PageWrapper title={adminMenu.students.text}>
			<SubHeader>
				<SubHeaderLeft>
					<label
						className="border-0 bg-transparent cursor-pointer me-0"
						htmlFor="searchInput"
					>
						<Icon icon="Search" size="2x" color="primary" />
					</label>
					<Input
						id="searchInput"
						type="search"
						className="border-0 shadow-none bg-transparent"
						placeholder="Search Students..."
						onChange={formik.handleChange}
						value={formik.values.searchInput}
					/>
				</SubHeaderLeft>
				<SubHeaderRight>

					<SubheaderSeparator />

					<Button
						icon="GroupAdd"
						color="primary"
						isLight
						onClick={() => setAddModalStatus(true)}
					>
						Assign Project
					</Button>
				</SubHeaderRight>
			</SubHeader>
			<Page>
				<div className="row h-100">
					<div className="col-12">
						<Card stretch>
							<CardBody isScrollable className="table-responsive">
								<table className="table table-modern table-hover">
									<thead>
										<tr>
											<th
												onClick={() => requestSort("Committee")}
												className="cursor-pointer text-decoration-underline"
											>
												Committee {" "}
												<Icon
													size="lg"
													className={getClassNamesFor("Name")}
													icon="FilterList"
												/>
											</th>
											
											<th>Assigned project</th>


											<td />
										</tr>
									</thead>
									<tbody>
										{dataPagination(items, currentPage, perPage).map(
											(i, key) => (
												<tr key={key}>
												


																<td>
																	<div className="d-flex align-items-center">
																		<div className="flex-shrink-0">
																			<div
																				className="ratio ratio-1x1 me-3"
																				style={{ width: 48 }}
																			>
																				<div
																					className={`bg-l${darkModeStatus ? "o25" : "25"
																						}-${getColorNameWithIndex(
																							key
																						)} text-${getColorNameWithIndex(
																							key
																						)} rounded-2 d-flex align-items-center justify-content-center`}
																				>
																					<span className="fw-bold">
																						{getFirstLetter(i.Committee)}
																					</span>
																				</div>
																			</div>
																		</div>
																		<div className="flex-grow-1">
																			<div className="fs-6 fw-bold">{i.Committee}</div>

																		</div>
																	</div>
																</td>
																<td>
																	{/* <div>{i.membershipDate.format('ll')}</div> */}
																	<div className="flex-grow-1">
																			<div className="fs-6 fw-bold">{i.Project}</div>

																		</div>
																</td>
															

																<td>



																	<Button
																		icon="Delete"
																		color="dark"
																		isLight
																		shadow="sm"
																		onClick={() => {

																			Swal.fire({
																				title: 'Are you sure?',
																				text: "You won't be able to revert this!",
																				icon: 'warning',
																				showCancelButton: true,
																				confirmButtonColor: '#3085d6',
																				cancelButtonColor: '#d33',
																				confirmButtonText: 'Yes, delete it!'
																			}).then((result) => {
																				if (result.isConfirmed) {
																					Delete(i.Committee, i.Project);
																					Swal.fire(
																						'Deleted!',
																						'Your file has been deleted.',
																						'success'
																					)
																				}
																			})

																		}}
																	/>

																</td>
															</tr>

														)
													
											
										)}
									</tbody>
								</table>
							</CardBody>
							<PaginationButtons
								data={filteredData}
								label="students"
								setCurrentPage={setCurrentPage}
								currentPage={currentPage}
								perPage={perPage}
								setPerPage={setPerPage}
							/>
						</Card>
					</div>
				</div>
			</Page>


			<AssignProjectAddModal
				setIsOpen={setAddModalStatus}
				isOpen={addModalStatus}
				id={0}
				reload={reload}
			/>



		</PageWrapper>
	);
};

export default AssignProject;





