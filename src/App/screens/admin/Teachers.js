import React, { useState, useEffect } from "react";
import { useFormik } from "formik";
import PageWrapper from "../../../layout/PageWrapper/PageWrapper";
import SubHeader, {
  SubHeaderLeft,
  SubHeaderRight,
  SubheaderSeparator,
} from "../../../layout/SubHeader/SubHeader";
import Page from "../../../layout/Page/Page";
import { demoPages } from "../../../menu";

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
import TeacherAddModal from "./TeacherAddModal";
import TeacherEditModal from "./TeacherEditModal";
import { getColorNameWithIndex } from "../../../common/data/enumColors";
import useDarkMode from "../../../hooks/useDarkMode";
import axios from "axios";
axios.defaults.withCredentials = true;

//////////////////////

import Card, {
  CardBody,

} from '../../../components/bootstrap/Card';
import Input from '../../../components/bootstrap/forms/Input';
;
import Button from '../../../components/bootstrap/Button';

/////////////////////////////




const Teachers = () => {
  const { darkModeStatus } = useDarkMode();

  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(PER_COUNT["10"]);

  const [allTeachers, setAllTeachers] = useState([])



  const getAllTeachers = async () => {

    const res = await axios.get("http://localhost:3500/admin/getAllTeachers",
      {
        withCredentials: true,
      });
    setAllTeachers(res.data)
    console.log("WE ARE Teachers", res.data)



  }



  useEffect(() => {
    getAllTeachers()
  }, []);

  const formik = useFormik({
    initialValues: {
      searchInput: "",
    },
    // eslint-disable-next-line no-unused-vars
    onSubmit: (values) => { },
  });

  const [refresh, setRefresh] = useState(false);

  const filteredData = allTeachers.filter((f, key) =>
    f.Name.toLowerCase().includes(formik.values.searchInput.toLowerCase())
  );

  const { items, requestSort, getClassNamesFor } = useSortableData(
    filteredData
  );

  const [editModalStatus, setEditModalStatus] = useState(false);
  const [addModalStatus, setAddModalStatus] = useState(false);
  const [teacherInfo, setTeacherInfo] = useState("")

  const Delete = async (Email) => {
    await axios.delete(`http://localhost:3500/admin/teacher/${Email}` ,
     { withCredentials: true });
     getAllTeachers()
  };

  return (
    <PageWrapper title={demoPages.crm.subMenu.customersList.text}>
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
            placeholder="Search Teachers..."
            onChange={formik.handleChange}
            value={formik.values.searchInput}
          />
        </SubHeaderLeft>
        <SubHeaderRight>

          <SubheaderSeparator />

          <Button
            icon="PersonAdd"
            color="primary"
            isLight
            onClick={() => setAddModalStatus(true)}
          >
            Add Teacher
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
                        Teachers{" "}
                        <Icon
                          size="lg"
                          className={getClassNamesFor("Name")}
                          icon="FilterList"
                        />
                      </th>
                      <th>Email</th>
                      <th>Phone Number</th>
                      <th
                        onClick={() => requestSort("Designation")}
                        className="cursor-pointer text-decoration-underline"
                      >
                        Designation
                        <Icon
                          size="lg"
                          className={getClassNamesFor("Designation")}
                          icon="FilterList"
                        />
                      </th>
                      <th className="cursor-pointer">Actions </th>
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
                                <div className="text-muted">
                                  <Icon icon="Label" /> <small>{i.Email}</small>
                                </div>
                              </div>
                            </div>
                          </td>
                          <td>
                            <Button
                              isLink
                              color="light"
                              icon="Email"
                              className="text-lowercase"
                              tag="a"
                              href={`mailto:${i.Email}`}
                            >
                              {i.Email}
                            </Button>
                          </td>
                          <td>
                            {/* <div>{i.membershipDate.format('ll')}</div> */}
                            <div>
                              +{i.PhoneNumber}
                            </div>
                          </td>
                          <td>{i.Designation}</td>
                          <td>
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
                                      Delete(i.Email);
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
                                      setTeacherInfo(i);
                                      setEditModalStatus(true)}}
                                  >
                                    Edit
                                  </Button>
                                </DropdownItem>
                              </DropdownMenu>
                            </Dropdown>
                          </td>
                        </tr>
                      )
                    )}
                  </tbody>
                </table>
              </CardBody>
              <PaginationButtons
                data={filteredData}
                label="Teachers"
                setCurrentPage={setCurrentPage}
                currentPage={currentPage}
                perPage={perPage}
                setPerPage={setPerPage}
              />
            </Card>
          </div>
        </div>
      </Page>
      <TeacherEditModal
        setIsOpen={setEditModalStatus}
        isOpen={editModalStatus}
        teacherInfo = {teacherInfo}
        id={0}
      />
      
      <TeacherAddModal
        setIsOpen={setAddModalStatus}
        isOpen={addModalStatus}
        id={0}
      />





    </PageWrapper>
  );
};

export default Teachers;
