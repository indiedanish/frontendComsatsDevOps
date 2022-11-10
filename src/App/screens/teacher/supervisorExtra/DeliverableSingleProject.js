import React, { useState, useEffect, useLayoutEffect } from "react";
import { useParams } from "react-router-dom";
import PageWrapper from "../../../../layout/PageWrapper/PageWrapper";
import SubHeader, {
  SubHeaderLeft,
  SubHeaderRight,
  SubheaderSeparator,
} from "../../../../layout/SubHeader/SubHeader";
import { useFormik } from "formik";

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

const DeliverableSingleProject = () => {
  const { projectname } = useParams();

  const { auth, setAuth } = useAuth();

  const { darkModeStatus } = useDarkMode();

  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(PER_COUNT["10"]);

  const [deliverables, setDeliverables] = useState([]);
  const [singleProject, setsingleProject] = useState(null);
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

  useLayoutEffect(() => {
    getProject();
    getprojectdeliverables;
  }, []);

  const filteredData = deliverables.filter((f, key) =>
    f.Title.toLowerCase().includes(formik.values.searchInput.toLowerCase())
  );

  const { items, requestSort, getClassNamesFor } = useSortableData(
    deliverables
  );

  const getprojectdeliverables = async (res) => {
    console.log("STUDENT himself: ", res);
    try {
      const response = await axios.put(
        "http://localhost:3500/student/getAllDeliverable",
        { ProjectName: projectname },
        {
          withCredentials: true, //correct
        }
      );

      setDeliverables(response);

      console.log("IM PROJECT DELIVERAABLE", response.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getprojectdeliverables;
  }, []);

  const [refresh, setRefresh] = useState(false);

  const reload = () => {};

  return (
    <PageWrapper title={"Deliverables"}>
      <SubHeader>
        <SubHeaderLeft>
          <label
            className="border-0 bg-transparent cursor-pointer me-0"
            htmlFor="searchInput"
          >
            <Icon icon="Search" size="2x" color="primary" />
          </label>
        </SubHeaderLeft>
        <SubHeaderRight>{/* <SubheaderSeparator /> */}</SubHeaderRight>
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
                        onClick={() => requestSort("Title")}
                        className="cursor-pointer text-decoration-underline"
                      >
                        Project Name{" "}
                        <Icon
                          size="lg"
                          className={getClassNamesFor("Title")}
                          icon="FilterList"
                        />
                      </th>
                      <th
                        onClick={() => requestSort("Deadline")}
                        className="cursor-pointer text-decoration-underline"
                      >
                       Deliverable Type
                        <Icon
                          size="lg"
                          className={getClassNamesFor("Deadline")}
                          icon="FilterList"
                        />
                      </th>

                      <th
                        onClick={() => requestSort("Deadline")}
                        className="cursor-pointer text-decoration-underline"
                      >
                        Date Modified
                        <Icon
                          size="lg"
                          className={getClassNamesFor("Deadline")}
                          icon="FilterList"
                        />
                      </th>
                      <th
                        onClick={() => requestSort("DateModified")}
                        className="cursor-pointer text-decoration-underline"
                      >
                        Download
                        <Icon
                          size="lg"
                          className={getClassNamesFor("Status")}
                          icon="FilterList"
                        />
                      </th>

                     
                    </tr>
                  </thead>
                  <tbody>
                    {singleProject?.data?.Deliverable.map((i, key) => (
                      <tr key={key}>
                        <td>
                          <div className="d-flex align-items-center">
                            <div className="flex-shrink-0">
                              <div
                                className="ratio ratio-1x1 me-3"
                                style={{ width: 48 }}
                              >
                                {/* <div
                                    className={`bg-l${darkModeStatus ? "o25" : "25"
                                      }-${getColorNameWithIndex(
                                        key
                                      )} text-${getColorNameWithIndex(
                                        key
                                      )} rounded-2 d-flex align-items-center justify-content-center`}
                                  >
                                    <span className="fw-bold">
                                      {getFirstLetter(i.Title)}
                                    </span>
                                  </div> */}
                              </div>
                            </div>
                            <div className="flex-grow-1">
                              <div className="fs-6 fw-bold">
                                {i.ProjectName}
                              </div>
                            </div>
                          </div>
                        </td>

                        <td>{i.Type}</td>

                        <td>
                          <div>
                            {new Date(i.DateModified).toLocaleString(
                              "en-US",

                              {
                                year: "numeric",
                                month: "numeric",
                                day: "numeric",
                              }
                              // {
                              //  day: '2-digit',
                              // 	 month: '2-digit',
                              // 	// year: 'numeric',
                              // 	// hour: '2-digit',
                              // 	// minute: '2-digit',
                              // 	// // second: '2-digit',
                              // 	// hour12: true,
                              // }
                            )}
                          </div>
                        </td>

                        <td>
                        <Button className="text-white "
                                  icon="Download"
                                  tag="a"
                                  type="File"
                                  download="Deliverable.pdf"
                                  href={i.File}
                                >
                              
                                </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </CardBody>
              <PaginationButtons
                data={filteredData}
                label="Deliverable"
                setCurrentPage={setCurrentPage}
                currentPage={currentPage}
                perPage={perPage}
                setPerPage={setPerPage}
              />
            </Card>
          </div>
        </div>
      </Page>
      {/* <DeliverableEditModal
        setIsOpen={setEditModalStatus}
        isOpen={editModalStatus}
        templateInfo={templateInfo}
        id={0}
        reload={reload}
      />

      <DeliverableAddModal
        reload={reload}
        setIsOpen={setAddModalStatus}
        isOpen={addModalStatus}
        id={0}
      /> */}
    </PageWrapper>
  );
};

export default DeliverableSingleProject;
