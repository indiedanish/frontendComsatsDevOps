import React, { useState, useEffect } from 'react';
import { useFormik } from 'formik';
import PageWrapper from '../../../layout/PageWrapper/PageWrapper';
import SubHeader, {
	SubHeaderLeft,
	SubHeaderRight,
	SubheaderSeparator,
} from '../../../layout/SubHeader/SubHeader';
import Page from '../../../layout/Page/Page';
import { demoPages } from '../../../menu';

import { getFirstLetter, priceFormat } from '../../../helpers/helpers';

import PaginationButtons, {
	dataPagination,
	PER_COUNT,
} from '../../../components/PaginationButtons';

import Icon from '../../../components/icon/Icon';

import Dropdown, {
	DropdownItem,
	DropdownMenu,
	DropdownToggle,
} from '../../../components/bootstrap/Dropdown';

import useSortableData from '../../../hooks/useSortableData';
import TemplateAddModal from './TemplateAddModal';
import TemplateEditModal from "./TemplateEditModal";
import { getColorNameWithIndex } from '../../../common/data/enumColors';
import useDarkMode from '../../../hooks/useDarkMode';
import axios from 'axios';
axios.defaults.withCredentials = true;

//////////////////////

import Card, { CardBody } from '../../../components/bootstrap/Card';
import Input from '../../../components/bootstrap/forms/Input';
import Button from '../../../components/bootstrap/Button';

/////////////////////////////

const Templates = () => {
	const { darkModeStatus } = useDarkMode();

	const [currentPage, setCurrentPage] = useState(1);
	const [perPage, setPerPage] = useState(PER_COUNT['10']);

	const [allTemplates, setAllTemplates] = useState([]);

	const reload = () => {
		getAllTemplates()  
	  }

	const getAllTemplates = async () => {
		const res = await axios.get('http://localhost:3500/admin/getAllTemplate', {
			withCredentials: true,
		});
		setAllTemplates(res.data);
		console.log('WE ARE Templates', res.data);
	};

	useEffect(() => {
		getAllTemplates();
	}, []);

	const formik = useFormik({
		initialValues: {
			searchInput: '',
		},
		// eslint-disable-next-line no-unused-vars
		onSubmit: (values) => {},
	});

	const [refresh, setRefresh] = useState(false);

	const filteredData = allTemplates.filter((f, key) =>
		f.Title.toLowerCase().includes(formik.values.searchInput.toLowerCase()),
	);

	const { items, requestSort, getClassNamesFor } = useSortableData(filteredData);

	const [editModalStatus, setEditModalStatus] = useState(false);
	const [addModalStatus, setAddModalStatus] = useState(false);
	const [templateInfo, setTemplateInfo] = useState('');

	const Delete = async (Title) => {
		await axios.delete(`http://localhost:3500/admin/template/${Title}`, {
			withCredentials: true,
		});
		getAllTemplates();
	};

	return (
		<PageWrapper title={demoPages.crm.subMenu.customersList.text}>
			<SubHeader>
				<SubHeaderLeft>
					<label
						className='border-0 bg-transparent cursor-pointer me-0'
						htmlFor='searchInput'>
						<Icon icon='Search' size='2x' color='primary' />
					</label>
					<Input
						id='searchInput'
						type='search'
						className='border-0 shadow-none bg-transparent'
						placeholder='Search Templates...'
						onChange={formik.handleChange}
						value={formik.values.searchInput}
					/>
				</SubHeaderLeft>
				<SubHeaderRight>
					<SubheaderSeparator />

					<Button
						icon='PersonAdd'
						color='primary'
						isLight
						onClick={() => setAddModalStatus(true)}>
						Add Template
					</Button>
				</SubHeaderRight>
			</SubHeader>
			<Page>
				<div className='row h-100'>
					<div className='col-12'>
						<Card stretch>
							<CardBody isScrollable className='table-responsive'>
								<table className='table table-modern table-hover'>
									<thead>
										<tr>
											<th
												onClick={() => requestSort('Title')}
												className='cursor-pointer text-decoration-underline'>
												Templates{' '}
												<Icon
													size='lg'
													className={getClassNamesFor('Title')}
													icon='FilterList'
												/>
											</th>

											<th
												onClick={() => requestSort('Description')}
												className='cursor-pointer text-decoration-underline'>
												Description
												<Icon
													size='lg'
													className={getClassNamesFor('Description')}
													icon='FilterList'
												/>
											</th>

											<th
												onClick={() => requestSort('DateModified')}
												className='cursor-pointer text-decoration-underline'>
												DateModified
												<Icon
													size='lg'
													className={getClassNamesFor('DateModified')}
													icon='FilterList'
												/>
											</th>
											<th
												onClick={() => requestSort('Deadline')}
												className='cursor-pointer text-decoration-underline'>
												Deadline
												<Icon
													size='lg'
													className={getClassNamesFor('Deadline')}
													icon='FilterList'
												/>
											</th>{' '}
											<td />
										</tr>
									</thead>
									<tbody>
										{dataPagination(items, currentPage, perPage).map(
											(i, key) => (
												<tr key={key}>
													<td>
														<div className='d-flex align-items-center'>
															<div className='flex-shrink-0'>
																<div
																	className='ratio ratio-1x1 me-3'
																	style={{ width: 48 }}>
																	<div
																		className={`bg-l${
																			darkModeStatus
																				? 'o25'
																				: '25'
																		}-${getColorNameWithIndex(
																			key,
																		)} text-${getColorNameWithIndex(
																			key,
																		)} rounded-2 d-flex align-items-center justify-content-center`}>
																		<span className='fw-bold'>
																			{getFirstLetter(
																				i.Title,
																			)}
																		</span>
																	</div>
																</div>
															</div>
															<div className='flex-grow-1'>
																<div className='fs-6 fw-bold'>
																	{i.Title}
																</div>
															</div>
														</div>
													</td>

													<td>{i.Description}</td>


													<td>
														{/* <div>{i.membershipDate.format('ll')}</div> */}
														<div>{i.DateModified}</div>
													</td>

													<td>{i.Deadline}</td>

													<td>
														<Dropdown>
															<DropdownToggle hasIcon={false}>
																<Button
																	icon='MoreHoriz'
																	color='dark'
																	isLight
																	shadow='sm'
																/>
															</DropdownToggle>
															<DropdownMenu isAlignmentEnd>
																<DropdownItem>
																	<Button
																		icon='Delete'
																		tag='a'
																		onClick={() => {
																			Delete(i.Title);
																			setRefresh(!refresh);
																		}}>
																		Delete
																	</Button>
																</DropdownItem>

																<DropdownItem>
																	<Button
																		icon='Download'
																		tag='a'
																		onClick={() => {
																			Delete(i.Title);
																			setRefresh(!refresh);
																		}}>
																		Download
																	</Button>
																</DropdownItem>

																<DropdownItem>
																	<Button
																		icon='Edit'
																		tag='a'
																		onClick={() => {
																			setTemplateInfo(i);
																			setEditModalStatus(
																				true,
																			);
																		}}>
																		Edit
																	</Button>
																</DropdownItem>
															</DropdownMenu>
														</Dropdown>
													</td>
												</tr>
											),
										)}
									</tbody>
								</table>
							</CardBody>
							<PaginationButtons
								data={filteredData}
								label='Templates'
								setCurrentPage={setCurrentPage}
								currentPage={currentPage}
								perPage={perPage}
								setPerPage={setPerPage}
							/>
						</Card>
					</div>
				</div>
			</Page>
			<TemplateEditModal
        setIsOpen={setEditModalStatus}
        isOpen={editModalStatus}
        templateInfo = {templateInfo}
        id={0}
      />
<<<<<<< HEAD
      
			<TemplateAddModal setIsOpen={setAddModalStatus} isOpen={addModalStatus} id={0} />
=======
       */}
			<TemplateAddModal reload={reload} setIsOpen={setAddModalStatus} isOpen={addModalStatus} id={0} />
>>>>>>> 7b3623f (updated)
		</PageWrapper>
	);
};

export default Templates;
