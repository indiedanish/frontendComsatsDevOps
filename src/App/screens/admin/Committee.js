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
import StudentAddModal from "./StudentAddModal";
import StudentEditModal from "./StudentEditModal";
import { getColorNameWithIndex } from "../../../common/data/enumColors";
import useDarkMode from "../../../hooks/useDarkMode";
import axios from "axios";
axios.defaults.withCredentials = true;

//////////////////////

import Card, {
	CardActions,
	CardBody,
	CardCodeView,
	CardFooter,
	CardFooterLeft,
	CardFooterRight,
	CardHeader,
	CardLabel,
	CardSubTitle,
	CardTitle,
} from '../../../components/bootstrap/Card';
import FormGroup from '../../../components/bootstrap/forms/FormGroup';
import Input from '../../../components/bootstrap/forms/Input';
;
import Button from '../../../components/bootstrap/Button';
import CommitteeAddModal from './CommitteeAddModal'

/////////////////////////////




const Committee = () => {

	const { darkModeStatus } = useDarkMode();

	const [currentPage, setCurrentPage] = useState(1);
	const [perPage, setPerPage] = useState(PER_COUNT["10"]);

	const [allStudents, setAllStudents] = useState([])

	const [studentSelf, setstudentSelf] = useState([]);

	const [groupMembers, setGroupMembers] = useState([]);

	const getAllCommittee = async () => {

		const res = await axios.get("http://localhost:3500/admin/getAllCommittee",
			{
				withCredentials: true,
			});
		setAllStudents(res.data)
		console.log("WE ARE STUDENTS", res.data)



	}

	useEffect(() => {
		getAllCommittee();
	}, [editModalStatus]);


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

	useEffect(() => {
		getAllCommittee()
		getstudentSelf();
	}, []);

	const formik = useFormik({
		initialValues: {
			searchInput: "",
		},
		// eslint-disable-next-line no-unused-vars
		onSubmit: (values) => { },
	});

	const [refresh, setRefresh] = useState(false);

	const filteredData = allStudents.filter((f, key) =>
		f.Name.toLowerCase().includes(formik.values.searchInput.toLowerCase())
	);

	const { items, requestSort, getClassNamesFor } = useSortableData(
		filteredData
	);

	const [editModalStatus, setEditModalStatus] = useState(false);
	const [addModalStatus, setAddModalStatus] = useState(false);
	const [studentInfo, setStudentInfo] = useState("")

	const Delete = async (RegNo) => {
		await axios.delete(`http://localhost:3500/admin/student/${RegNo}`,
			{ withCredentials: true });
		getAllCommittee()
	};

	const reload = () => {
		getAllCommittee()
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
						Add Committee
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
												onClick={() => requestSort("Name")}
												className="cursor-pointer text-decoration-underline"
											>
												Students{" "}
												<Icon
													size="lg"
													className={getClassNamesFor("Name")}
													icon="FilterList"
												/>
											</th>
											<th>Teacher-1</th>
											<th>Teacher-2</th>
											<th>Teacher-3</th>

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
																			{getFirstLetter(i.Name)}
																		</span>
																	</div>
																</div>
															</div>
															<div className="flex-grow-1">
																<div className="fs-6 fw-bold">{i.Name}</div>

															</div>
														</div>
													</td>
													<td>
														{/* <div>{i.membershipDate.format('ll')}</div> */}
														<div>

															{i.Teacher[0] == undefined ? "-" : i.Teacher[0].Name}
														</div>
													</td>
													<td>
														{/* <div>{i.membershipDate.format('ll')}</div> */}
														<div>
															{i.Teacher[1] == undefined ? "-" : i.Teacher[1].Name}
														</div>
													</td>

													<td>
														{/* <div>{i.membershipDate.format('ll')}</div> */}
														<div>
															{i.Teacher[2] == undefined ? "-" : i.Teacher[2].Name}
														</div>
													</td>
													{/* <td>{priceFormat(i.RegNo)}</td> */}
													<td>

														<Button
															icon="Delete"
															color="dark"
															isLight
															shadow="sm"
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


			<CommitteeAddModal
				setIsOpen={setAddModalStatus}
				isOpen={addModalStatus}
				id={0}
			/>



		</PageWrapper>
	);
};

export default Committee;





