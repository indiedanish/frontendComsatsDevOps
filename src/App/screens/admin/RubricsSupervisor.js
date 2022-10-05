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
} from "../../../components/bootstrap/Card";
import FormGroup from "../../../components/bootstrap/forms/FormGroup";
import Input from "../../../components/bootstrap/forms/Input";
import Button from "../../../components/bootstrap/Button";
import SweetAlert from "react-bootstrap-sweetalert";
import Swal from "sweetalert2";

const RubricsSupervisor = () => {
  const { darkModeStatus } = useDarkMode();

  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(PER_COUNT["10"]);

  const [questions, setQuestions] = useState([]);
  const [rubrics, setRubrics] = useState([]);
  const [Name, setName] = useState("Testing");

  const getAllRubrics = async () => {
    const res = await axios.get(
      "http://localhost:3500/admin/getSupervisorRubrics",
      {
        withCredentials: true,
      }
    );

    setRubrics(res.data);

    setQuestions(res.data[0].Questions);
    console.log("ALL RUBRICS", res.data);
    
  };

  useEffect(() => {
    getAllRubrics();
  }, [editModalStatus]);

  useEffect(() => {
    getAllRubrics();
  }, []);

  const formik = useFormik({
    initialValues: {
      searchInput: "",
    },
    // eslint-disable-next-line no-unused-vars
    onSubmit: (values) => { },
  });

  const [refresh, setRefresh] = useState(false);

  const filteredData = questions.filter((f, key) =>
    f.Criteria.toLowerCase().includes(formik.values.searchInput.toLowerCase())
  );

  const { items, requestSort, getClassNamesFor } = useSortableData(
    filteredData
  );

  const [editModalStatus, setEditModalStatus] = useState(false);
  const [addModalStatus, setAddModalStatus] = useState(false);
  const [studentInfo, setStudentInfo] = useState("");

  const Delete = async (RegNo) => {
    await axios.delete(`http://localhost:3500/admin/student/${RegNo}`, {
      withCredentials: true,
    });
    getAllRubrics();
  };

  const reload = () => {
    getAllRubrics();
  };

  const addQuestionCall = async (Question, TotalMark) => {
   


    await axios.put(`http://localhost:3500/admin/supervisorAddQuestion`, 
    { Question_Object: { Criteria: Question, TotalMark: TotalMark }, Name: Name },
    {
      withCredentials: true,
    });

    getAllRubrics();
  };

  const showQuestionModal = async () => {
    const { value: formValues } = await Swal.fire({
      title: "Question/Marks",
      html:
        '<input id="swal-input1" placeholder="Enter Question" class="swal2-input">' +
        '<input id="swal-input2" placeholder="Enter Total Marks"  class="swal2-input">',
      focusConfirm: false,
      preConfirm: () => {
        return [
          addQuestionCall(
            document.getElementById("swal-input1").value,
            document.getElementById("swal-input2").value
          ),
        ];
      },
    });

    return;
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
            placeholder="Search Students..."
            onChange={formik.handleChange}
            value={formik.values.searchInput}
          />
        </SubHeaderLeft>
        <SubHeaderRight>
          <Button
            icon="PersonAdd"
            color="primary"
            isLight
            onClick={() => {
              setName("Scope")
              setQuestions(rubrics[0].Questions)
            }}
          >
            Scope
          </Button>

          <Button
            icon="PersonAdd"
            color="primary"
            isLight
            onClick={() => { setName("SDS"); setQuestions(rubrics[1].Questions) }}
          >
            SDS
          </Button>

          <Button
            icon="PersonAdd"
            color="primary"
            isLight
            onClick={() => { setName("Testing"); setQuestions(rubrics[2].Questions) }}
          >
            Testing
          </Button>

          <Button
            icon="PersonAdd"
            color="primary"
            isLight
            onClick={() => { setName("Final"); setQuestions(rubrics[3].Questions) }}
          >
            Final
          </Button>

        

          <SubheaderSeparator />

          <Button
            icon="Add"
            color="primary"
            isLight
            onClick={() => showQuestionModal()}
          >
            Add Questions
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
                        Criteria{" "}
                        <Icon
                          size="lg"
                          className={getClassNamesFor("Name")}
                          icon="FilterList"
                        />
                      </th>
                      <th>Total Marks</th>

                      <th className="cursor-pointer">Actions </th>
                      <td />
                    </tr>
                  </thead>
                  <tbody>
                    {questions.map((i, key) => (
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

                        {/* <td>{priceFormat(i.Name)}</td> */}
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
                                    Delete(i.Name);
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
                                    setStudentInfo(i);
                                    setEditModalStatus(true);
                                  }}
                                >
                                  Edit
                                </Button>
                              </DropdownItem>
                            </DropdownMenu>
                          </Dropdown>
                        </td>
                      </tr>
                    ))}
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
      <StudentEditModal
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
      />
    </PageWrapper>
  );
};

export default RubricsSupervisor;
