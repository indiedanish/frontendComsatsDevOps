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
import Modal, { ModalBody, ModalFooter, ModalHeader, ModalTitle } from '../../../components/bootstrap/Modal';
import { useFormik } from "formik";
import Card, {
  CardActions,
  CardBody,
  CardFooter,
  CardFooterLeft,
  CardHeader,
  CardLabel,
  CardSubTitle,
  CardTitle,
} from "../../../components/bootstrap/Card";


import Checks, { ChecksGroup } from '../../../components/bootstrap/forms/Checks';

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


import data from "../../../common/data/dummyEventsData";
import USERS from "../../../common/data/userDummyData";
import EVENT_STATUS from "../../../common/data/enumEventStatus";
import Avatar from "../../../components/Avatar";
import PaginationButtons, {
  dataPagination,
  PER_COUNT,
} from "../../../components/PaginationButtons";
import useSortableData from "../../../hooks/useSortableData";

import InputGroup from '../../../components/bootstrap/forms/InputGroup';
import useAuth from "../../../hooks/useAuth";
import axios from "axios";
axios.defaults.withCredentials = true;
import { Grid, Radio } from "react-loader-spinner";
import Select from "../../../components/bootstrap/forms/Select";
import Option from "../../../components/bootstrap/Option";
import Chat, { ChatGroup } from '../../../components/Chat';
import CHATS from '../../../common/data/chatDummyData';

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

  const formikAddTask = useFormik({
    initialValues: {
      title: "",
      description: "",
      teammember: "",

      status: "",
      end: ""

      // date: moment().add(1, "days").format("YYYY-MM-DD"),


    },

    // validate,

    onSubmit: (values) => {
      setUpcomingEventsEditOffcanvas(false);

      addToDatabase(values);
    },
  });




  const addToDatabase = async (values) => {

    console.log(values)

    //requirement POST

    const response = await axios.post(
      "http://localhost:3500/student/requirement",
      {
        Title: values.title,
        Description: values.description,
        Priority: values.status,
        AssignedTo: values.teammember,
        Type: "Design",
        ProjectName: projectInfo.data.Name,

        end: values.end,
      },

      {
        withCredentials: true, //correct
      }
    );

    const notification = {
      title: "Requirement",
      content: values.title,
      sender: studentSelf.data.Name,
      senderImg: studentSelf.data.ProfilePicture,
      receiverId: values.teammember
    }

    try {
      const res = await axios.post("http://localhost:3500/notification", notification);
      console.log(res)

    } catch (err) {
      console.log(err);
    }

    setEditModalStatus(false)
    Swal.fire("Task Assigned!", "Task has been assigned successfully", "success");
    getstudentSelf();
    console.log(response)


  }

  const editToDatabase = async (values) => {
    const Accepted = values.type === "Accepted" ? true : false;

    console.log("THSE ARE VALUES", values, " OLD: ", tempName, " PROJECTNAME", projectInfo.data.Name)
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
      getstudentSelf()

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

  useEffect(() => {
    getstudentSelf();

    getProject();
  }, [newComment]);



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

  const [tempID, settempID] = useState(null)

  const getAccepted = () => {
    var accepted = 0;
    console.log(projectInfo);
    projectInfo.data.Requirements.map((item) => {
      if (item.Accepted && item.Type == "Design") {
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
      if (!item.Accepted && item.Type == "Design") {
        rejected++;
        return item;
      }
    });

    return rejected;
  };

  const deleteFromDatabase = async (title) => {


    try {
      const response = await axios.put(
        "http://localhost:3500/student/requirement",
        { Title: title, ProjectName: projectInfo.data.Name },

        {
          withCredentials: true, //correct
        }
      );
      getstudentSelf()

      Swal.fire("Deleted!", "Task has been deleted successfully", "success");

      console.log("After assigning: ", response);
    } catch (err) {
      console.log(err);
      Swal.fire("Server Error!", "", "error");
    }

    setUpcomingEventsEditOffcanvas(false);
  };


  const [editModalStatus, setEditModalStatus] = useState(false);

  const [submitTaskModal, setsubmitTaskModal] = useState(false)



  const [newComment, setNewComment] = useState("");
  const [comments, setComments] = useState([]);

  const sendComment = async (e) => {


    console.log("AAAAA")

    e.preventDefault();

    console.log(studentSelf)
    const comment = {
      Sender: studentSelf,
      Content: newComment,
      Title: taskToBeSubmitted.Title
    };

    try {
      const res = await axios.post("http://localhost:3500/student/addRequirementComments",
        {
          Sender: studentSelf,
          Content: newComment,
          Title: taskToBeSubmitted.Title


        },
        {
          withCredentials: true, //correct
        })
      setComments([...comments, comment]);
      setNewComment("");


    } catch (err) {
      console.log(err);
    }

    if (taskToBeSubmitted.AssignedTo != studentSelf.data._id) {


      const notification = {
        title: "Comment",
        content: taskToBeSubmitted.Title,
        sender: studentSelf.data.Name,
        senderImg: studentSelf.data.ProfilePicture,
        //receiverId: values.teammember
        receiverId: taskToBeSubmitted.AssignedTo
      }


      try {
        const response = await axios.post("http://localhost:3500/notification", notification);
        console.log(response)

      } catch (err) {
        console.log(err);
      }

    }

  }






  const card =
  {
    id: 'Card3',
    title: 'Landing Page Update',
    subtitle: 'Omtanke Team',
    description: 'Will be redesigned',
    label: '5 day left',
    user: USERS.GRACE,
    tags: ["DEVELPOEMNT", "TAGS.code"],
    tasks: [
      { id: 1, text: 'Draft drawings will be made', status: true },
      { id: 2, text: 'Page will be updated', status: false },
      { id: 3, text: 'Will be sent for review.', status: false },
    ],
    attachments: [{ id: 2, path: 'somefile.txt', file: 'WORD' }],
  }




























  const submitToDatabase = async (values) => {


    console.log("THSE ARE VALUES", tempName, " PROJECTNAME", projectInfo.data.Name)
    try {
      const response = await axios.put(
        "http://localhost:3500/student/requirementLead",
        {
          Title: tempName,
          File: getFileBase64String,
          Description: values.description,
          ProjectName: projectInfo.data.Name,
          Accepted: true


        },

        {
          withCredentials: true, //correct
        }
      );

      Swal.fire("Submitted!", "", "success");
      getstudentSelf()
      console.log("After assigning: ", response);
    } catch (err) {
      console.log(err);
      Swal.fire("Server Error!", "", "error");
    }
  };








  const formikSubmitTask = useFormik({
    initialValues: {
      title: "",
      priority: "",
      teammember: "",
      status: "",

      date: moment().add(1, "days").format("YYYY-MM-DD"),

      description: "",
    },



    onSubmit: (values) => {


      submitToDatabase(values);
    },
  });






  const [getFileBase64String, setFileBase64String] = useState(null);


  const [taskToBeSubmitted, settaskToBeSubmitted] = useState(null)



  const encodeFileBase64 = (file) => {

    console.log("encodeFileBase64 FUN", file)



    var reader = new FileReader();


    reader.readAsDataURL(file);

    reader.onload = () => {
      var Base64 = reader.result;
      console.log("Base64", Base64);
      setFileBase64String(Base64)

    };




  };

  return (
    <>
      {projectInfo == null ?

        (
          <div className="w- flex flex-col  h-[700px] justify-center items-center">
            <Radio
              height="150"
              width="150"
              color="#6C5DD3"
              ariaLabel="grid-loading"
              radius="12.5"
              wrapperStyle={{}}
              wrapperClass=""
              visible={true}
            />
            {selectedTask == null ? <h4 className="mt-5">Check if you are added to any group</h4> : ""}


          </div>
        )
        :



        selectedTask == null ? (
          <div className="w- flex flex-col  h-[700px] justify-center items-center">
            <Radio
              height="150"
              width="150"
              color="#6C5DD3"
              ariaLabel="grid-loading"
              radius="12.5"
              wrapperStyle={{}}
              wrapperClass=""
              visible={true}
            />
            {selectedTask == null ? <h4 className="mt-5">No tasks assigned currently</h4> : ""}


          </div>
        ) : (
          <PageWrapper title="Design">
            <SubHeader>
              {/* <SubHeaderLeft>
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
            </SubHeaderLeft> */}
              <SubHeaderRight className="flex justify-between bg-red w-full">
                <Popovers
                  desc={
                    <DatePicker
                      onChange={(item) => setDate(item)}
                      date={date}
                      color={process.env.REACT_APP_PRIMARY_COLOR}
                    />
                  }
                  placement="bottom-end"
                  className="mw-100 flex"
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

                <Button className="flex " color={themeStatus}
                  onClick={() => { window.open("http://localhost:8080/") }}>
                  Design Tool

                </Button>
              </SubHeaderRight>
            </SubHeader>
            <Page container="fluid">
              <>
                <Card stretch={true}>
                  <CardHeader borderSize={1}>
                    <CardLabel icon="Box" iconColor="info">
                      <CardTitle className="pl-3"> Design Panel</CardTitle>
                    </CardLabel>
                    <CardActions>
                      {auth.Role == "TeamMember" ? "" : <Button
                        color="info"
                        icon="add"
                        isLight
                        tag="a"
                        onClick={() => {
                          setEditModalStatus(true)
                        }}
                        target="_blank"

                      >
                        Add Design Work
                      </Button>}
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
                          <th></th>
                          <td />
                        </tr>
                      </thead>
                      <tbody>
                        {projectInfo.data.Requirements.map((item) => {

                          if (item.Type == "Design")
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
                                    <div>{item?.AssignedTo?.Role}</div>
                                    <div className="small text-muted">
                                      {item?.AssignedTo?.Email}
                                    </div>
                                  </div>
                                </td>
                                <td>
                                  <div className="d-flex">
                                    <div className="flex-shrink-0">
                                      <Avatar
                                        src={item?.AssignedTo?.ProfilePicture}
                                        srcSet={item?.AssignedTo?.ProfilePicture}
                                        color={item?.Title}
                                        size={36}
                                      />
                                    </div>
                                    <div className="flex-grow-1 ms-3 d-flex align-items-center text-nowrap">
                                      {`${item?.AssignedTo?.Name}`}
                                    </div>
                                  </div>
                                </td>
                                <td>{item?.Title}</td>

                                <td>{item?.Priority}</td>
                                {/* <td>{item.payment && priceFormat(item.payment)}</td> */}
                                <td>
                                  <Button
                                    isLink
                                    color={item?.Accepted ? "success" : "danger"}
                                    icon="Circle"
                                    className="text-nowrap"
                                  >
                                    {item?.Accepted ? "Accepted" : "Pending"}
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
                                {auth.Role == "TeamMember" ? "" : <td>
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
                                </td>}

                                <td>
                                  <Button
                                    isOutline={!darkModeStatus}
                                    color="dark"
                                    isLight={darkModeStatus}
                                    className={classNames("text-nowrap", {
                                      "border-light": !darkModeStatus,
                                    })}
                                    icon="send"
                                    //setselectedTask
                                    onClick={() => {



                                      setsubmitTaskModal(true)
                                      setComments(item.Comments)
                                      settaskToBeSubmitted(item)

                                    }}
                                  >
                                    Submit
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























                <Modal
                  setIsOpen={setsubmitTaskModal}
                  isOpen={submitTaskModal}
                  size='lg'
                  isScrollable
                  data-tour='mail-app-modal'>
                  <ModalHeader className='px-4' setIsOpen={setsubmitTaskModal}>

                  </ModalHeader>
                  <ModalBody className='px-4'>
                    <div className='row'>
                      <div className='col-md-8'>
                        <Card shadow='sm'>
                          <CardHeader>
                            <CardLabel icon='Info' iconColor='success'>
                              <CardTitle>Design Work Information</CardTitle>
                            </CardLabel>
                          </CardHeader>
                          <CardBody>
                            <div className='row g-4'>
                              <FormGroup
                                className='col-12'
                                id='title'
                                label='Task Name'>
                                <Input

                                  onChange={formikSubmitTask.handleChange}
                                  value={taskToBeSubmitted?.Title ? taskToBeSubmitted.Title : "No Name"}
                                />
                              </FormGroup>
                              <FormGroup
                                className='col-12'
                                id='description'
                                label='Description'>
                                <Textarea

                                  onChange={formikSubmitTask.handleChange}
                                  defaultValue={taskToBeSubmitted?.Description}
                                />
                              </FormGroup>
                            </div>
                          </CardBody>
                        </Card>
                        {card.attachments && (
                          <Card shadow='sm'>
                            <CardHeader>
                              <CardLabel icon='AttachFile' iconColor='danger'>
                                <CardTitle>Attachment</CardTitle>
                                <CardSubTitle>
                                  files
                                </CardSubTitle>
                              </CardLabel>
                              <CardActions>
                                <Button color='danger' isOutline>
                                  Attach
                                </Button>
                              </CardActions>
                            </CardHeader>
                            <CardBody>
                              <div className='row g-3'>

                                <div className='col-auto'>
                                  <Input
                                    required
                                    type="file"
                                    onChange={(e) => {
                                      encodeFileBase64(e.target.files[0]);
                                    }}
                                  />
                                </div>

                              </div>
                            </CardBody>
                          </Card>
                        )}

                        <Card shadow='sm'>
                          <CardHeader>
                            <CardLabel icon='QuestionAnswer' iconColor='info'>
                              <CardTitle>Comments</CardTitle>
                            </CardLabel>
                          </CardHeader>
                          <CardBody>
                            <Chat>
                              {taskToBeSubmitted?.Comments.map((msg) => (

                                <ChatGroup
                                  messages={msg.Content}
                                  user={msg.Sender}


                                  isReply={false}
                                />
                              ))}
                            </Chat>
                          </CardBody>
                          <CardFooter className='d-block'>
                            <InputGroup>
                              <Textarea
                                onChange={(e) => setNewComment(e.target.value)}
                                value={newComment} />
                              <Button color='info' icon='Send'
                                onClick={sendComment}>

                                SEND
                              </Button>
                            </InputGroup>
                          </CardFooter>
                        </Card>
                      </div>
                      <div className='col-md-4'>
                        <div className='row g-4 sticky-top'>
                          <FormGroup className='col-12' id='assignedTo' label='AssignedTo'>
                            <Select
                              disable
                              ariaLabel='Board select'
                              placeholder={`${taskToBeSubmitted?.AssignedTo == undefined ? "Not Assigned" : taskToBeSubmitted?.AssignedTo?.Name}`}

                              defaultValue={taskToBeSubmitted?.AssignedTo?.Name}>

                            </Select>
                          </FormGroup>
                          <FormGroup className='col-12' id='priority' label='Priority'>
                            <Select
                              disable
                              ariaLabel='Board select'
                              placeholder={`${taskToBeSubmitted?.Priority}`}

                              defaultValue={taskToBeSubmitted?.Priority}>

                            </Select>
                          </FormGroup>

                          <FormGroup className='col-12' id='accepted' label='Accepted'>
                            <Select

                              ariaLabel='Board select'
                              placeholder={`${taskToBeSubmitted?.Accepted == true ? "Accepted" : "Pending"}`}

                              defaultValue={taskToBeSubmitted?.Accepted}>


                              <Option value="Accepted">Accepted</Option>
                              <Option value="Pending">Pending</Option>

                            </Select>

                          </FormGroup>

                        </div>
                      </div>
                    </div>
                  </ModalBody>
                  <ModalFooter className='px-4 pb-4'>
                    <Button
                      color='primary'
                      className='w-100'
                      type='submit'
                      onClick={() => {



                        settempName(taskToBeSubmitted.Title)
                        formikSubmitTask.handleSubmit()
                      }

                      }

                    >
                      Submit
                    </Button>
                  </ModalFooter>
                </Modal>



































                <OffCanvas
                  setOpen={setUpcomingEventsEditOffcanvas}
                  isOpen={upcomingEventsEditOffcanvas}
                  titleId="upcomingEdit"
                  isBodyScroll
                  placement="end"
                >
                  <OffCanvasHeader setOpen={setUpcomingEventsEditOffcanvas}>
                    <OffCanvasTitle id="upcomingEdit">
                      Edit Design Work
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

                <Modal setIsOpen={setEditModalStatus} isOpen={editModalStatus} size='lg' isScrollable>
                  <ModalHeader className='px-4' setIsOpen={setEditModalStatus}>

                  </ModalHeader>
                  <ModalBody className='px-4'>
                    <div className='row'>
                      <div className='col-md-8'>
                        <Card shadow='sm'>
                          <CardHeader>
                            <CardLabel icon='Info' iconColor='success'>
                              <CardTitle>Design Work</CardTitle>
                            </CardLabel>
                          </CardHeader>
                          <CardBody>
                            <div className='row g-4'>
                              <FormGroup
                                className='col-12'
                                id='title'
                                label='Design Work Title'>
                                <Input
                                  onChange={formikAddTask.handleChange}
                                  value={formikAddTask.values.title}
                                />
                              </FormGroup>
                              <FormGroup
                                className='col-12'
                                id='description'
                                label='Description'>
                                <Textarea
                                  onChange={formikAddTask.handleChange}
                                  value={formikAddTask.values.description}
                                />
                              </FormGroup>
                            </div>
                          </CardBody>
                        </Card>
                      </div>
                      <div className='col-md-4'>
                        <div className='row g-4 sticky-top'>
                          <FormGroup className='col-12' id='status' label='Status'>
                            <Select
                              ariaLabel='status select'
                              placeholder='Select status'
                              onChange={formikAddTask.handleChange}
                              value={formikAddTask.values.status}>

                              <Option value="High">High</Option>
                              <Option value="Medium">Medium</Option>
                              <Option value="Low">Low</Option>

                            </Select>
                          </FormGroup>
                          <FormGroup className='col-12' id='teammember' label='Group Members'>
                            <Select
                              ariaLabel='Board select'
                              placeholder='Select group'
                              onChange={formikAddTask.handleChange}
                              value={formikAddTask.values.teammember}>
                              {projectInfo.data.GroupMembers.map((u) => (
                                <Option key={u.RegNo} value={u._id}>
                                  {`${u.RegNo}`}
                                </Option>
                              ))}
                            </Select>
                          </FormGroup>


                          <FormGroup id="end" label="Deadline">
                            <Input
                              type="datetime-local"
                              value={moment(formikAddTask.values.end).format(
                                moment.HTML5_FMT.DATETIME_LOCAL
                              )}
                              onChange={formikAddTask.handleChange}
                            />
                          </FormGroup>


                        </div>
                      </div>
                    </div>
                  </ModalBody>
                  <ModalFooter className='px-4 pb-4'>
                    <Button
                      color='primary'
                      className='w-100'
                      type='submit'
                      onClick={formikAddTask.handleSubmit}>
                      Save
                    </Button>
                  </ModalFooter>
                </Modal>
              </>
            </Page>
          </PageWrapper>
        )}
    </>
  );
};

export default ListFluidPage;