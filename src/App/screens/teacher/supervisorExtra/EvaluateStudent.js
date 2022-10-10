import React, { useState, useEffect, useLayoutEffect } from "react";
import { useParams } from "react-router-dom";
import { useFormik } from "formik";
import PageWrapper from "../../../../layout/PageWrapper/PageWrapper";
import SubHeader, {
  SubHeaderLeft,
  SubHeaderRight,
  SubheaderSeparator,
} from "../../../../layout/SubHeader/SubHeader";
import Page from "../../../../layout/Page/Page";
import { adminMenu } from "../../../../menu";

import { getFirstLetter, priceFormat } from "../../../../helpers/helpers";

import PaginationButtons, {
  dataPagination,
  PER_COUNT,
} from "../../../../components/PaginationButtons";

import Icon from "../../../../components/icon/Icon";

import Dropdown, {
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
} from "../../../../components/bootstrap/Dropdown";

import useSortableData from "../../../../hooks/useSortableData";
// import StudentAddModal from "./StudentAddModal";
// import StudentEditModal from "./StudentEditModal";
import { getColorNameWithIndex } from "../../../../common/data/enumColors";
import useDarkMode from "../../../../hooks/useDarkMode";
import { useNavigate } from "react-router-dom";
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
} from "../../../../components/bootstrap/Card";
import FormGroup from "../../../../components/bootstrap/forms/FormGroup";
import Input from "../../../../components/bootstrap/forms/Input";
import Button from "../../../../components/bootstrap/Button";
import SweetAlert from "react-bootstrap-sweetalert";
import Swal from "sweetalert2";
import useAuth from "../../../../hooks/useAuth";

const EvaluateStudent = () => {
  const { projectname } = useParams();
  const { studentregno } = useParams();
  const { fypstatus } = useParams();
  const { auth, setAuth } = useAuth();

  const { darkModeStatus } = useDarkMode();

  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(PER_COUNT["10"]);

  const [questions, setQuestions] = useState([]);
  const [rubrics, setRubrics] = useState([]);
  const [singleProject, setsingleProject] = useState(null);
  const [obtainedMarks, setobtainedMarks] = useState([]);
  const [studentSelf, setstudentSelf] = useState(null);
  const navigate = useNavigate();
  const getProject = async () => {
    const response = await axios.post(
      "http://localhost:3500/teacher/getProject",
      { Name: projectname },
      {
        withCredentials: true, //correct
      }
    );
    setsingleProject(response);
    console.log("ProjectDetails: ", response.data);
  };

  const getstudentSelf = async () => {
    const response = await axios.post(
      "http://localhost:3500/student/getStudent",
      { RegNo: studentregno },
      {
        withCredentials: true, //correct
      }
    );

    setstudentSelf(response);
    console.log("STUDENT himself: ", response.data);
  };

  useLayoutEffect(() => {
    getProject();
    getstudentSelf();
  }, []);

  const makeQuesWithObtainedMarks = async (ques) => {
    fypstatus == "Scope"
      ? setQuestions(ques.data[0].Questions)
      : fypstatus == "SDS"
      ? setQuestions(ques.data[1].Questions)
      : fypstatus == "Testing"
      ? setQuestions(ques.data[2].Questions)
      : fypstatus == "Final"
      ? setQuestions(ques.data[3].Questions)
      : "";

    var temp = ques.data[0].Questions;

    console.log("IM NEW OBEE", temp);

    var temp2 = temp.map((item) => {
      return {
        Criteria: item.Criteria,
        TotalMark: item.TotalMark,
        ObtainedMarks: "",
      };
    });

    console.log("TEMP@ ", temp2);

    setobtainedMarks(temp2);
  };

  useEffect(() => {
    console.log("obtainedMarks", obtainedMarks);
  }, [obtainedMarks]);

  const getAllRubrics = async () => {
    const res = await axios.get(
      "http://localhost:3500/admin/getSupervisorRubrics",
      {
        withCredentials: true,
      }
    );

    setRubrics(res.data);

    console.log("ALL RUBRICS", res.data[0].Questions);

    makeQuesWithObtainedMarks(res);
  };

  useEffect(() => {
    getAllRubrics();
  }, []);

  const formik = useFormik({
    initialValues: {
      searchInput: "",
    },
    // eslint-disable-next-line no-unused-vars
    onSubmit: (values) => {},
  });

  const [refresh, setRefresh] = useState(false);

  const filteredData = questions.filter((f, key) =>
    f.Criteria.toLowerCase().includes(formik.values.searchInput.toLowerCase())
  );

  const { items, requestSort, getClassNamesFor } = useSortableData(
    filteredData
  );

  const [addModalStatus, setAddModalStatus] = useState(false);
  const [studentInfo, setStudentInfo] = useState("");

  const reload = () => {
    getAllRubrics();
  };

  function isNumeric(val) {
    return /^-?\d+$/.test(val);
  }

  const addToDatabase = async (text) => {
    console.log(
      "ADDING TO DATABSE: ",
      projectname,
      auth.Email,
      studentregno,
      text,
      obtainedMarks
    );

    try {
      const response = await axios.post(
        "http://localhost:3500/teacher/SupervisorEvaluation",
        {
          Name: projectname,
          Teacher: auth.Email,
          Student: studentregno,
          Remarks: text,
          Questions: obtainedMarks,
        },
        {
          withCredentials: true,
        }
      );

      Swal.fire("Submitted!", "Sutdents marks have been added", "success");
      navigate(-1);
    } catch (error) {
      Swal.fire("Network Error!", `${error.message}`, "error");
    }
  };

  const popup = async () => {
    const { value: text } = await Swal.fire({
      input: "textarea",
      inputLabel: "Message",
      inputPlaceholder: "Type your message here...",
      inputAttributes: {
        "aria-label": "Type your message here",
      },
      showCancelButton: true,
    });

    if (text) {
      addToDatabase(text);
    }
  };

  return (
    <PageWrapper title={adminMenu.rubrics.text}>
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
            placeholder="Search Questions..."
            onChange={formik.handleChange}
            value={formik.values.searchInput}
          />
        </SubHeaderLeft>
        <SubHeaderRight>
          <Button icon="PersonAdd" color="primary" isLight>
            {fypstatus}
          </Button>
          <SubheaderSeparator />
          <Button icon="PersonAdd" color="primary" isLight>
            {projectname}
          </Button>
          <SubheaderSeparator />
          <Button icon="Person" color="primary" isLight>
            {studentregno}
          </Button>

          <SubheaderSeparator />

          <Button
            icon="Send"
            color="primary"
            isLight
            onClick={() => {
              popup();
            }}
          >
            Submit Evaluation
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
                        <span className="text-[#6A5CD0]">
                          Evaluation Questions
                        </span>

                        <Icon
                          size="lg"
                          className={getClassNamesFor("Name")}
                          icon="FilterList"
                        />
                      </th>
                      <th>Total Marks</th>

                      <th>Obtained Marks </th>
                      <th>Enter marks </th>
                      <td />
                    </tr>
                  </thead>
                  <tbody>
                    {obtainedMarks.map((i, key) => (
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
                                  {/* <span className="fw-bold">
                                    {getFirstLetter(i.Criteria)}
                                  </span> */}
                                </div>
                              </div>
                            </div>
                            <div className="flex-grow-1">
                              <div className="fs-6 fw-bold">{i.Criteria}</div>
                              <div className="text-muted">
                                <Icon icon="Label" />{" "}
                                <small>{i.Criteria}</small>
                              </div>
                            </div>
                          </div>
                        </td>
                        <td>
                          <Button
                            isLink
                            color="light"
                            icon="Total Marks"
                            className="text-lowercase"
                            tag="a"
                            href={`mailto:${i.TotalMark}`}
                          >
                            {i.TotalMark}
                          </Button>
                        </td>

                        <td>{i.ObtainedMarks}</td>

                        <td>
                          <Input
                            value={i.ObtainedMarks}
                            onChange={(e) => {
                              if (
                                e.target.value > obtainedMarks[key].TotalMark ||
                                isNumeric(e.target.value) == false || e.target.value < 0
                              ) {
                                Swal.fire(
                                  "Please enter marks less than total marks",
                                  "Please try again",
                                  "error"
                                );
                              } else {
                                obtainedMarks[key].ObtainedMarks =
                                  e.target.value;
                                var temp = obtainedMarks.map((i) => i);
                                setobtainedMarks(temp);
                              }
                            }}
                            style={{ width: "100px" }}
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </CardBody>
              <PaginationButtons
                data={filteredData}
                label="Rubrics"
                setCurrentPage={setCurrentPage}
                currentPage={currentPage}
                perPage={perPage}
                setPerPage={setPerPage}
              />
            </Card>
          </div>
        </div>
      </Page>

      {/* <StudentEditModal
        setIsOpen={setEditModalStatus}
        isOpen={editModalStatus}
        studentInfo={studentInfo}
        id={0}
        reload={reload}
      />

      <StudentAddModal
        setIsOpen={setAddModalStatus}
        isOpen={addModalStatus}
        id={0}
        reload={reload}
      /> */}
    </PageWrapper>
  );
};

export default EvaluateStudent;
