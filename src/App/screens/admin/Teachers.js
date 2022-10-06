import React, { useState, useEffect } from 'react';
import classNames from 'classnames';
import { useFormik } from 'formik';
import SubHeader, { SubHeaderLeft, SubHeaderRight } from '../../../layout/SubHeader/SubHeader';
import Icon from '../../../components/icon/Icon';
import Page from '../../../layout/Page/Page';
import PageWrapper from '../../../layout/PageWrapper/PageWrapper';
import Card, { CardBody } from '../../../components/bootstrap/Card';
import USERS from '../../../common/data/userDummyData';
import CommonFilterTag from '../../../pages/common/CommonFilterTag';
import Badge from '../../../components/bootstrap/Badge';
import Button from '../../../components/bootstrap/Button';
import Breadcrumb from '../../../components/bootstrap/Breadcrumb';
import FormGroup from '../../../components/bootstrap/forms/FormGroup';
import Label from '../../../components/bootstrap/forms/Label';
import Input from '../../../components/bootstrap/forms/Input';
import Checks, { ChecksGroup } from '../../../components/bootstrap/forms/Checks';
import SERVICES from '../../../common/data/serviceDummyData';
import { adminMenu, demoPages } from '../../../menu';
import useTourStep from '../../../hooks/useTourStep';
import axios from 'axios'
import Dropdown, {
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
} from "../../../components/bootstrap/Dropdown";
import TeacherAddModal from "./TeacherAddModal";
import TeacherEditModal from "./TeacherEditModal";
const Teachers = () => {


  const [editModalStatus, setEditModalStatus] = useState(false);
  const [addModalStatus, setAddModalStatus] = useState(false);

  const [teacherInfo, setTeacherInfo] = useState("")
  const [allTeachers, setAllTeachers] = useState([])

  const reload = () => {
    getAllTeachers()
  }

  const getAllTeachers = async () => {

    const res = await axios.get("http://localhost:3500/admin/getAllTeachers",
      {
        withCredentials: true,
      });
    setAllTeachers(res.data)
    console.log("WE ARE STUDENTS", res.data)



  }

  const Delete = async (Email) => {
    await axios.delete(`http://localhost:3500/admin/teacher/${Email}`,
      { withCredentials: true });
    getAllTeachers()
  };

  useEffect(() => {
    getAllTeachers();
  }, []);

  const [filterMenu, setFilterMenu] = useState(false);

  const formik = useFormik({
    initialValues: {
      available: false,
      searchInput: '',
      services: [],
    },
    // eslint-disable-next-line no-unused-vars
    onSubmit: (values) => {
      setFilterMenu(false);
      // alert(JSON.stringify(values, null, 2));
    },
  });

  const searchUsers = allTeachers.filter((f, key) =>
    f.Name.toLowerCase().includes(formik.values.searchInput.toLowerCase())
  );
  return (
    <PageWrapper title={adminMenu.teachers.text}>
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
            placeholder='Search...'
            onChange={formik.handleChange}
            value={formik.values.searchInput}
          />
        </SubHeaderLeft>
        <SubHeaderRight>

        <CommonFilterTag title='Total Teachers' text={allTeachers.length} />
         
          <Button
            icon='Add'
            color='info'
            isLight
            tag='a'
            onClick={() => setAddModalStatus(true)}>
            Add Teacher
          </Button>
        </SubHeaderRight>
      </SubHeader>
      <Page container='fluid'>
     
        <div className='row row-cols-xxl-3 row-cols-lg-3 row-cols-md-2'>
          {searchUsers.map((user) => (
            <div key={user.RegNo} className='col'>
              <Card>
                <CardBody>
                  <div className='row g-3'>
                    <div className='col d-flex'>
                      <div className='flex-shrink-0'>
                        <div className='position-relative'>
                          <div
                            className='ratio ratio-1x1'
                            style={{ width: 100 }}>
                            <div
                              className={classNames(
                                `bg-l25-${user.Name}`,
                                'rounded-2',
                                'd-flex align-items-center justify-content-center',
                                'overflow-hidden',
                                'shadow',
                              )}>
                              <img
                                src={user.ProfilePicture}
                                alt={user.Name}
                                width={100}
                              />
                            </div>
                          </div>
                          {/* {user.isOnline && (
														<span className='position-absolute top-100 start-85 translate-middle badge border border-2 border-light rounded-circle bg-success p-2'>
															<span className='visually-hidden'>
																Online user
															</span>
														</span>
													)} */}
                        </div>
                      </div>
                      <div className='flex-grow-1 ms-3 d-flex justify-content-between'>
                        <div className='w-100'>
                          <div className='row'>
                            <div className='col'>
                              <div className='d-flex align-items-center'>
                                <div className='fw-bold fs-5 me-2'>
                                  {` ${user.Name}`}
                                </div>
                                <small className='border border-success border-2 text-success fw-bold px-2 py-1 rounded-1'>
                                  {user.Designation}
                                </small>
                                <small className='border ml-3 border-danger border-2 text-danger fw-bold px-2 py-1 rounded-1'>
                                  {user.isCommittee?user.isSupervisor?"Both":"Committee":"Supervisor" }
                                </small>
                              </div>

                              <div className='text-muted'>
                                @{user.Email}
                              </div>
                            </div>
                            <div className='col-auto'>

                              <Dropdown>
                                <DropdownToggle hasIcon={false}>
                                  <Button
                                    icon="MoreHoriz"
                                    color="dark"
                                    isLight
                                    shadow="sm"
                                  />
                                </DropdownToggle>
                                <DropdownMenu isAlignmentEnd>
                                  <DropdownItem>
                                    <Button
                                      icon="Delete"
                                      tag="a"
                                      onClick={() => {
                                        Delete(user.Email);
                                        setRefresh(!refresh);
                                      }}
                                    >
                                      Delete
                                    </Button>
                                  </DropdownItem>

                                  <DropdownItem>
                                    <Button
                                      icon="Edit"
                                      tag="a"
                                      onClick={() => {
                                        setTeacherInfo(user);
                                        setEditModalStatus(true)
                                      }}
                                    >
                                      Edit
                                    </Button>
                                  </DropdownItem>
                                </DropdownMenu>
                              </Dropdown>

                            </div>
                          </div>

                        </div>
                      </div>
                    </div>
                  </div>
                </CardBody>
              </Card>
            </div>
          ))}
        </div>
      </Page>

      <TeacherEditModal
        setIsOpen={setEditModalStatus}
        isOpen={editModalStatus}
        teacherInfo={teacherInfo}
        id={0}
        reload={reload}
      />

      <TeacherAddModal
        setIsOpen={setAddModalStatus}
        isOpen={addModalStatus}
        id={0}
        reload={reload}
      />
    </PageWrapper>
  );
};

export default Teachers;