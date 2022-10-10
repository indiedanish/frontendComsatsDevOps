import React, { useState, useEffect } from "react";
import moment from "moment";
import { Calendar as DatePicker } from "react-date-range";
import SubHeader, {
  SubHeaderLeft,
  SubHeaderRight,
} from "../../../layout/SubHeader/SubHeader";
import Icon from "../../../components/icon/Icon";
import Button from "../../../components/bootstrap/Button";
import Page from "../../../layout/Page/Page";
import PageWrapper from "../../../layout/PageWrapper/PageWrapper";
// import CommonUpcomingEvents from '../../../pages/common/CommonUpcomingEvents';
import Popovers from "../../../components/bootstrap/Popovers";
import { demoPages } from "../../../menu";
import useDarkMode from "../../../hooks/useDarkMode";

import classNames from "classnames";

import { useFormik } from "formik";
import Card, {
  CardActions,
  CardBody,
  CardHeader,
  CardLabel,
  CardTitle,
} from "../../../components/bootstrap/Card";

import { priceFormat } from "../../../helpers/helpers";
import Dropdown, {
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
} from "../../../components/bootstrap/Dropdown";

import OffCanvas, {
  OffCanvasBody,
  OffCanvasHeader,
  OffCanvasTitle,
} from "../../../components/bootstrap/OffCanvas";
import FormGroup from "../../../components/bootstrap/forms/FormGroup";
import Input from "../../../components/bootstrap/forms/Input";
import Textarea from "../../../components/bootstrap/forms/Textarea";
import Checks from "../../../components/bootstrap/forms/Checks";

import data from "../../../common/data/dummyEventsData";
import USERS from "../../../common/data/userDummyData";
import EVENT_STATUS from "../../../common/data/enumEventStatus";
import Avatar from "../../../components/Avatar";
import PaginationButtons, {
  dataPagination,
  PER_COUNT,
} from "../../../components/PaginationButtons";
import useSortableData from "../../../hooks/useSortableData";
import useAuth from "../../../hooks/useAuth";
import axios from "axios";
axios.defaults.withCredentials = true;
import { Grid } from "react-loader-spinner";
import Select from "../../../components/bootstrap/forms/Select";
import Option from "../../../components/bootstrap/Option";
import Swal from "sweetalert2";
const ListFluidPage = () => {
  const { darkModeStatus, themeStatus } = useDarkMode();
  const [date, setDate] = useState(new Date());

  // BEGIN :: Upcoming Events
  const [
    upcomingEventsInfoOffcanvas,
    setUpcomingEventsInfoOffcanvas,
  ] = useState(false);
  const handleDetails = () => {
    setUpcomingEventsInfoOffcanvas(!upcomingEventsInfoOffcanvas);
  };

  const [
    upcomingEventsEditOffcanvas,
    setUpcomingEventsEditOffcanvas,
  ] = useState(false);
  const handleUpcomingEdit = () => {
    setUpcomingEventsEditOffcanvas(!upcomingEventsEditOffcanvas);
  };
  // END :: Upcoming Events

  const validate = (values) => {
    const errors = {};
    if (!values.title) {
      errors.title = "Required";
    } else if (values.title.length > 15) {
      errors.title = "Must be 15 characters or less";
    }

    if (!values.priority) {
      errors.priority = "Required";
    }
    if (!values.teammember) {
      errors.teammember = "Required";
    }

    if (!values.status) {
      errors.status = "Required";
    }

    if (!values.date) {
      errors.date = "Required";
    }

    if (!values.description) {
      errors.description = "Required";
    }

    // else if (values.description.length > 200) {
    // 	errors.description = 'Must be less then 200 characters';
    // }

    return errors;
  };

  const formik = useFormik({
    initialValues: {
      title: "",
      priority: "",
      teammember: "",
      status: "",

      date: moment().add(1, "days").format("YYYY-MM-DD"),

      description: "",
    },

    validate,

    onSubmit: (values) => {
      setUpcomingEventsEditOffcanvas(false);

      editToDatabase(values);
    },
  });

  const editToDatabase = async (values) => {
    const Accepted = values.type === "Accepted" ? true : false;
    try {
      const response = await axios.put(
        "http://localhost:3500/student/requirementLead",
        {
          Title: tempName,
          Rename: values.title,
          ProjectName: projectInfo.data.Name,
          Description: values.description,
          Priority: values.priority,
          Accepted: Accepted,
          TeamMember: values.teammember,
          end: values.date,
        },

        {
          withCredentials: true, //correct
        }
      );

      Swal.fire("Submitted!", "", "success");

      console.log("After assigning: ", response);
    } catch (err) {
      console.log(err);
      Swal.fire("Server Error!", "", "error");
    }
  };

  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(PER_COUNT["5"]);
  const { items, requestSort, getClassNamesFor } = useSortableData(data);
  const [selectedTask, setselectedTask] = useState(null);

  const [details, setDetails] = useState("");

  //////////////////////////////////////////////////////////////////////

  useEffect(() => {
    getstudentSelf();
  }, []);

  const { auth, setAuth } = useAuth();
  const [studentSelf, setstudentSelf] = useState(null);
  const [projectInfo, setprojectInfo] = useState(null);
  //   projectInfo.data.Requirements
  const [tasks, setTasks] = useState([]);

  const getProject = async (res) => {
    const response = await axios.post(
      "http://localhost:3500/student/project",
      { Name: res.data.Project.Name },
      {
        withCredentials: true, //correct
      }
    );
    // setsingleProject(response);
    console.log("ProjectDetails: ", response.data);

    setprojectInfo(response);
  };

  const getstudentSelf = async () => {
    console.log("MY REGNO: ", auth.RegNo);

    const response = await axios.post(
      "http://localhost:3500/student/getStudent",
      { RegNo: auth.RegNo },
      {
        withCredentials: true, //correct
      }
    );

    setstudentSelf(response);
    console.log("res.data : ", response.data);
    setTasks(response.data.Project.Requirements);
    setselectedTask(response.data.Project.Requirements[0]);
    getProject(response);

    console.log("IMLATEE");
  };

  const [tempName, settempName] = useState(null);

  const getAccepted = () => {
    var accepted = 0;
    console.log(projectInfo);
    projectInfo.data.Requirements.map((item) => {
      if (item.Accepted && item.Type == "Testing") {
        accepted++;
        return item;
      }
    });

    return accepted;
  };

  const getRejected = () => {
    var rejected = 0;
    console.log(projectInfo);
    projectInfo.data.Requirements.map((item) => {
      if (!item.Accepted && item.Type == "Testing") {
        rejected++;
        return item;
      }
    });

    return rejected;
  };

  const deleteFromDatabase = async (title) => {
    alert(title + " " + projectInfo.data.Name);

    try {
      const response = await axios.put(
        "http://localhost:3500/student/requirement",
        { Title: title, ProjectName: projectInfo.data.Name },

        {
          withCredentials: true, //correct
        }
      );
      getProject()

      Swal.fire("Submitted!", "", "success");

      console.log("After assigning: ", response);
    } catch (err) {
      console.log(err);
      Swal.fire("Server Error!", "", "error");
    }

    setUpcomingEventsEditOffcanvas(false);
  };

  return (
    <>
      {projectInfo == null ? (
        <div className="w- flex  h-[700px] justify-center items-center">
          <Grid
            height="150"
            width="150"
            color="#6C5DD3"
            ariaLabel="grid-loading"
            radius="12.5"
            wrapperStyle={{}}
            wrapperClass=""
            visible={true}
          />
        </div>
      ) : (
        <PageWrapper title="Testing">
          <SubHeader>
            <SubHeaderLeft>
              <Icon icon="Info" className="me-2" size="2x" />
              <span className="text-muted">
                You have{" "}
                <Icon
                  icon="TaskAlt"
                  color="success"
                  className="mx-1"
                  size="lg"
                />{" "}
                {getAccepted()} accepted tests and{" "}
                <Icon
                  icon="cancel"
                  color="warning"
                  className="mx-1"
                  size="lg"
                />{" "}
                {getRejected()} pending tests.
              </span>
            </SubHeaderLeft>
            <SubHeaderRight>
              <Popovers
                desc={
                  <DatePicker
                    onChange={(item) => setDate(item)}
                    date={date}
                    color={process.env.REACT_APP_PRIMARY_COLOR}
                  />
                }
                placement="bottom-end"
                className="mw-100"
                trigger="click"
              >
                <Button color={themeStatus}>
                  {`${moment(date)
                    .startOf("weeks")
                    .format("MMM Do")} - ${moment(date)
                    .endOf("weeks")
                    .format("MMM Do")}`}
                </Button>
              </Popovers>
            </SubHeaderRight>
          </SubHeader>
          <Page container="fluid">
            <>
              <Card stretch={true}>
                <CardHeader borderSize={1}>
                  <CardLabel icon="Box" iconColor="info">
                    <CardTitle className="pl-3"> Testing Panel</CardTitle>
                  </CardLabel>
                  <CardActions>
                    <Button
                      color="info"
                      icon="CloudDownload"
                      isLight
                      tag="a"
                     
                      target="_blank"
                    
                    >
                      Add Test
                    </Button>
                  </CardActions>
                </CardHeader>
                <CardBody className="table-responsive" isScrollable={true}>
                  <table className="table table-modern">
                    <thead>
                      <tr>
                        <td style={{ width: 60 }} />
                        <th
                          onClick={() => requestSort("date")}
                          className="cursor-pointer text-decoration-underline"
                        >
                          Deadline{" "}
                          <Icon
                            size="lg"
                            className={getClassNamesFor("date")}
                            icon="FilterList"
                          />
                        </th>
                        <th>Role</th>
                        <th>Assigned to</th>
                        <th>Title</th>

                        <th>Priority</th>
                        <th>Status</th>
                        <td />
                      </tr>
                    </thead>
                    <tbody>
                      {projectInfo.data.Requirements.map((item) => {
                        if (item.Type == "Testing")
                          return (
                            <tr key={item.id}>
                              <td></td>
                              <td>
                                <div className="d-flex align-items-center">
                                  {/* <span
												className={classNames(
													'badge',
													'border border-2',
													[`border-${themeStatus}`],
													'rounded-circle',
													'bg-success',
													'p-2 me-2',
													`bg-${item.status.color}`,
												)}>
												<span className='visually-hidden'>
													{item.status.name}
												</span>
											</span> */}
                                  <span className="text-nowrap">
                                    {moment(` ${item.end}`).format(
                                      "MMM Do YYYY, h:mm a"
                                    )}
                                  </span>
                                </div>
                              </td>
                              <td>
                                <div>
                                  <div>{item.AssignedTo.Role}</div>
                                  <div className="small text-muted">
                                    {item.AssignedTo.Email}
                                  </div>
                                </div>
                              </td>
                              <td>
                                <div className="d-flex">
                                  <div className="flex-shrink-0">
                                    <Avatar
                                      src={item.AssignedTo.ProfilePicture}
                                      srcSet={item.AssignedTo.ProfilePicture}
                                      color={item.Title}
                                      size={36}
                                    />
                                  </div>
                                  <div className="flex-grow-1 ms-3 d-flex align-items-center text-nowrap">
                                    {`${item.AssignedTo.Name}`}
                                  </div>
                                </div>
                              </td>
                              <td>{item.Title}</td>

                              <td>{item.Priority}</td>
                              {/* <td>{item.payment && priceFormat(item.payment)}</td> */}
                              <td>
                                <Button
                                  isLink
                                  color={item.Accepted ? "success" : "danger"}
                                  icon="Circle"
                                  className="text-nowrap"
                                >
                                  {item.Accepted ? "Accepted" : "Pending"}
                                </Button>

                                {/* <DropdownMenu>
												{Object.keys(EVENT_STATUS).map((key) => (
													<DropdownItem key={key}>
														<div>
															<Icon
																icon='Circle'
																color={EVENT_STATUS[key].color}
															/>
															{EVENT_STATUS[key].name}
														</div>
													</DropdownItem>
												))}
											</DropdownMenu> */}
                              </td>
                              <td>
                                <Button
                                  isOutline={!darkModeStatus}
                                  color="dark"
                                  isLight={darkModeStatus}
                                  className={classNames("text-nowrap", {
                                    "border-light": !darkModeStatus,
                                  })}
                                  icon="Edit"
                                  //setselectedTask
                                  onClick={() => {
                                    settempName(item.Title);
                                    setselectedTask(item);
                                    handleUpcomingEdit();
                                  }}
                                >
                                  Edit
                                </Button>
                              </td>
                            </tr>
                          );
                        else return "";
                      })}
                    </tbody>
                  </table>
                </CardBody>
                <PaginationButtons
                  data={items}
                  label="items"
                  setCurrentPage={setCurrentPage}
                  currentPage={currentPage}
                  perPage={perPage}
                  setPerPage={setPerPage}
                />
              </Card>

              <OffCanvas
                setOpen={setUpcomingEventsEditOffcanvas}
                isOpen={upcomingEventsEditOffcanvas}
                titleId="upcomingEdit"
                isBodyScroll
                placement="end"
              >
                <OffCanvasHeader setOpen={setUpcomingEventsEditOffcanvas}>
                  <OffCanvasTitle id="upcomingEdit">
                    Edit Appointments
                  </OffCanvasTitle>
                </OffCanvasHeader>
                <OffCanvasBody>
                  <div className="row g-4">
                    <div className="col-12">
                      <FormGroup id="title" label="Title">
                        <Input
                          defaultValue={`${selectedTask.Title}`}
                          onChange={formik.handleChange}
                          isValid={formik.isValid}
                          isTouched={formik.touched.title}
                          invalidFeedback={formik.errors.title}
                          validFeedback="Looks good!"
                          onBlur={formik.handleBlur}
                        />
                      </FormGroup>
                    </div>

                    <div className="col-12">
                      <FormGroup
                        id="priority"
                        label="Priority"
                        className="col-md"
                      >
                        <Select
                          placeholder="Select Priority..."
                          onChange={formik.handleChange}
                          ariaLabel="Team member select"
                          defaultValue={`${selectedTask.Priority}`}
                        >
                          <Option value="Low">Low</Option>
                          <Option value="Medium">Medium</Option>
                          <Option value="High">High</Option>
                        </Select>
                      </FormGroup>
                    </div>

                    <div className="col-12">
                      <FormGroup
                        id="teammember"
                        label="Select Team Member"
                        className="col-md"
                      >
                        <Select
                          placeholder="Please select..."
                          onChange={formik.handleChange}
                          defaultValue={`${selectedTask.Priority}`}
                          ariaLabel="Team member select"
                        >
                          {projectInfo.data.GroupMembers.map((u, k) => (
                            <Option key={k} value={u._id}>
                              {`${u.RegNo}`}
                            </Option>
                          ))}
                        </Select>
                      </FormGroup>
                    </div>

                    <div className="col-12">
                      <FormGroup id="status" label="Status" className="col-md">
                        <Select
                          placeholder="Select Status..."
                          onChange={formik.handleChange}
                          defaultValue={`${selectedTask.Accepted}`}
                          ariaLabel="Status select"
                        >
                          <Option value="Accepted">Accepted</Option>
                          <Option value="Pending">Pending</Option>
                        </Select>
                      </FormGroup>
                    </div>

                    <div className="col-12">
                      <FormGroup id="date" label="Date">
                        <Input
                          onChange={formik.handleChange}
                          defaultValue={`${selectedTask.end}`}
                          type="datetime-local"
                        />
                      </FormGroup>
                    </div>

                    <div className="col-12">
                      <Card
                        isCompact
                        borderSize={2}
                        shadow="none"
                        className="mb-0"
                      >
                        <CardHeader>
                          <CardLabel>
                            <CardTitle>Description</CardTitle>
                          </CardLabel>
                        </CardHeader>
                        <CardBody>
                          <FormGroup id="description" label="Enter here....">
                            <Textarea
                              onChange={formik.handleChange}
                              defaultValue={`${selectedTask.Description}`}
                            />
                          </FormGroup>
                        </CardBody>
                      </Card>
                    </div>
                  </div>
                </OffCanvasBody>
                <div className="row m-0">
                  <div className="col-12 p-3 pb-0">
                    <Button
                      color="danger"
                      className="w-100"
                      onClick={() => deleteFromDatabase(selectedTask.Title)}
                    >
                      Delete
                    </Button>
                  </div>
                </div>
                <div className="row m-0">
                  <div className="col-12 p-3">
                    <Button
                      color="info"
                      className="w-100"
                      onClick={formik.handleSubmit}
                      //onClick={() => setUpcomingEventsEditOffcanvas(false)}
                    >
                      Assign
                    </Button>
                  </div>
                </div>
              </OffCanvas>
            </>
          </Page>
        </PageWrapper>
      )}
    </>
  );
};

export default ListFluidPage;
