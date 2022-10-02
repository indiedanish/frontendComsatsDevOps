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
import Card, { CardBody } from "../../../components/bootstrap/Card";
import { getFirstLetter, priceFormat } from "../../../helpers/helpers";
import data from "../../../common/data/dummyCustomerData";
import PaginationButtons, {
  dataPagination,
  PER_COUNT,
} from "../../../components/PaginationButtons";
import Button from "../../../components/bootstrap/Button";
import Icon from "../../../components/icon/Icon";
import Input from "../../../components/bootstrap/forms/Input";
import Dropdown, {
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
} from "../../../components/bootstrap/Dropdown";
import FormGroup from "../../../components/bootstrap/forms/FormGroup";
import Checks, {
  ChecksGroup,
} from "../../../components/bootstrap/forms/Checks";
import PAYMENTS from "../../../common/data/enumPaymentMethod";
import useSortableData from "../../../hooks/useSortableData";
import InputGroup, {
  InputGroupText,
} from "../../../components/bootstrap/forms/InputGroup";
import Popovers from "../../../components/bootstrap/Popovers";
import CustomerEditModal from "./CustomerEditModal";
import { getColorNameWithIndex } from "../../../common/data/enumColors";
import useDarkMode from "../../../hooks/useDarkMode";
import axios from "axios";

const CustomersList = () => {
  const { darkModeStatus } = useDarkMode();

  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(PER_COUNT["10"]);

  var [use, setuse] = useState([]);

  

  const [tasks, setTasks] = useState([]);

  const [studentSelf, setstudentSelf] = useState([]);

  const [projectInfo, setProjectInfo] = useState([]);
  const [groupMembers, setGroupMembers] = useState([]);

  const getProject = async (projectname) => {
    console.log("projectname", projectname);
    const response = await axios.post(
      "http://localhost:3500/student/project",
      { Name: projectname },
      {
        withCredentials: true,
      }
    );
    console.log("Project Info: ", response.data);
    setProjectInfo(response.data);
    setGroupMembers(response.data.GroupMembers);
    console.log("Group Members!!!: ", response.data.GroupMembers);
    setTasks(response.data.Requirements);
  };

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

    getProject(response.data.Project.Name);
  };

  useEffect(() => {
    getstudentSelf();
  }, []);

  const formik = useFormik({
    initialValues: {
      searchInput: "",
    },
    // eslint-disable-next-line no-unused-vars
    onSubmit: (values) => {},
  });

  const [refresh, setRefresh] = useState(false);

  const filteredData = groupMembers.filter((f, key) =>
    f.Name.toLowerCase().includes(formik.values.searchInput.toLowerCase())
  );

  const { items, requestSort, getClassNamesFor } = useSortableData(
    filteredData
  );

  const [editModalStatus, setEditModalStatus] = useState(false);

  const Delete = async (id) => {
    await axios.delete(`http://localhost:4000/student/${id}`);
    getData();
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
            placeholder="Search Team Member..."
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
            onClick={() => setEditModalStatus(true)}
          >
            Assign Team
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
                        Team Member{" "}
                        <Icon
                          size="lg"
                          className={getClassNamesFor("Name")}
                          icon="FilterList"
                        />
                      </th>
                      <th>Email</th>
                      <th>Position</th>
                      <th
                        onClick={() => requestSort("RegNo")}
                        className="cursor-pointer text-decoration-underline"
                      >
                        Registeration #
                        <Icon
                          size="lg"
                          className={getClassNamesFor("balance")}
                          icon="FilterList"
                        />
                      </th>
                      <th className="cursor-pointer">Delete </th>
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
                                    className={`bg-l${
                                      darkModeStatus ? "o25" : "25"
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
                              <small className="text-muted">{i.Position}</small>
                            </div>
                          </td>
                          <td>{priceFormat(i.RegNo)}</td>
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
                                    icon="Visibility"
                                    tag="a"
                                    onClick={() => {
                                      Delete(i._id);
                                      setRefresh(!refresh);
                                    }}
                                  >
                                    Delete
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
                label="customers"
                setCurrentPage={setCurrentPage}
                currentPage={currentPage}
                perPage={perPage}
                setPerPage={setPerPage}
              />
            </Card>
          </div>
        </div>
      </Page>
      <CustomerEditModal
        setIsOpen={setEditModalStatus}
        isOpen={editModalStatus}
        id={0}
      />
    </PageWrapper>
  );
};

export default CustomersList;
