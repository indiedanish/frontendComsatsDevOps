import React, { useState, useEffect, useLayoutEffect } from "react";
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
import Card, { CardBody } from "../../../components/bootstrap/Card";
import Input from "../../../components/bootstrap/forms/Input";
import Button from "../../../components/bootstrap/Button";
import useSortableData from "../../../hooks/useSortableData";
// import DeliverableAddModal from "./DeliverableAddModal";
// import DeliverableEditModal from "./DeliverableEditModal";
import { getColorNameWithIndex } from "../../../common/data/enumColors";
import useDarkMode from "../../../hooks/useDarkMode";


import axios from "axios";
axios.defaults.withCredentials = true;
import useAuth from "../../../hooks/useAuth";

import { Cookies } from "react-cookie";
import jwt_decode from "jwt-decode";



const Deliverable = () => {


  const [getProjectDeliverables, setgetProjectDeliverables] = useState([]);
  const [deliverablesStatuses, setDeliverablesStatuses] = useState([false, false, false, false]);

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
    console.log("response data: ", response.data);
    const temp = response.data;



    getprojectdeliverables(response)


  };

  const setStatuses = async (deliverables) => {

    console.log("deliverables: ", deliverables.data);

    const temp = deliverables.data.map((i) => { return i.Status.toString() })
    //deliverablesStatuses
    setDeliverablesStatuses(temp)









  };


  const getprojectdeliverables = async (res) => {

    console.log("STUDENT himself: ", res);
    try {
      const response = await axios.put(
        "http://localhost:3500/student/getAllDeliverable",
        { ProjectName: res.data.Project.Name },
        {
          withCredentials: true, //correct
        }
      );

      setStatuses(response)

      console.log("IM PROJECT DELIVERAABLE", response.data)
    } catch (err) {
      console.log(err);
    }

  }

  useEffect(() => {

    getstudentSelf();

    getAllDeliverable();

  }, []);








  const { darkModeStatus } = useDarkMode();

  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(PER_COUNT["10"]);

  const [allDeliverable, setAllDeliverable] = useState([]);

  const reload = () => {
    getAllDeliverable();
  };

  const getAllDeliverable = async () => {
    const res = await axios.get("http://localhost:3500/admin/getAllTemplate", {
      withCredentials: true,
    });
    setAllDeliverable(res.data);
    console.log("WE ARE Templates", res.data);
  };



  const formik = useFormik({
    initialValues: {
      searchInput: "",
    },
    // eslint-disable-next-line no-unused-vars
    onSubmit: (values) => { },
  });

  const [refresh, setRefresh] = useState(false);

  const filteredData = allDeliverable.filter((f, key) =>
    f.Title.toLowerCase().includes(formik.values.searchInput.toLowerCase())
  );

  const { items, requestSort, getClassNamesFor } = useSortableData(
    filteredData
  );

  const [editModalStatus, setEditModalStatus] = useState(false);
  const [addModalStatus, setAddModalStatus] = useState(false);
  const [templateInfo, setDeliverableInfo] = useState("");


  return (
    <PageWrapper title={adminMenu.templates.text}>
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
            placeholder="Search Deliverable..."
            onChange={formik.handleChange}
            value={formik.values.searchInput}
          />
        </SubHeaderLeft>
        <SubHeaderRight>
          {/* <SubheaderSeparator /> */}


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
                        onClick={() => requestSort("Title")}
                        className="cursor-pointer text-decoration-underline"
                      >
                        Deliverable{" "}
                        <Icon
                          size="lg"
                          className={getClassNamesFor("Title")}
                          icon="FilterList"
                        />
                      </th>
                      <th
                        onClick={() => requestSort("Description")}
                        className="cursor-pointer text-decoration-underline"
                      >
                        Description
                        <Icon
                          size="lg"
                          className={getClassNamesFor("Description")}
                          icon="FilterList"
                        />
                      </th>

                      <th
                        onClick={() => requestSort("Deadline")}
                        className="cursor-pointer text-decoration-underline"
                      >
                        Deadline
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
                        Date Modified
                        <Icon
                          size="lg"
                          className={getClassNamesFor("Status")}
                          icon="FilterList"
                        />
                      </th>

                      <th
                        onClick={() => requestSort("DateModified")}
                        className="cursor-pointer text-decoration-underline"
                      >
                        Status
                        <Icon
                          size="lg"
                          className={getClassNamesFor("Status")}
                          icon="FilterList"
                        />
                      </th>
                      <th className="cursor-pointer">Actions </th>{" "}
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
                                      {getFirstLetter(i.Title)}
                                    </span>
                                  </div>
                                </div>
                              </div>
                              <div className="flex-grow-1">
                                <div className="fs-6 fw-bold">{i.Title}</div>
                              </div>
                            </div>
                          </td>

                          <td>{i.Description}</td>

                          <td>{new Date(i.Deadline).toLocaleString(
                            "en-US",

                            { year: "numeric", month: "numeric", day: "numeric" }
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
                          </td>
                          <td>
                            <div>{new Date(i.DateModified).toLocaleString(
                              "en-US",

                              { year: "numeric", month: "numeric", day: "numeric" }
                              // {
                              //  day: '2-digit',
                              // 	 month: '2-digit',
                              // 	// year: 'numeric',
                              // 	// hour: '2-digit',
                              // 	// minute: '2-digit',
                              // 	// // second: '2-digit',
                              // 	// hour12: true,
                              // }
                            )}</div>
                          </td>

                          <td>{deliverablesStatuses[key] == undefined || deliverablesStatuses[key] == "false" ? "Not Submitted" : "Submitted"}</td>

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
                                    icon="Download"
                                    tag="a"
                                    type="File"
                                    download="Deliverable.pdf"
                                    href={i.File}

                                  >
                                    Download
                                  </Button>
                                </DropdownItem>

                                <DropdownItem>
                                  <Button
                                    icon="Send"
                                    tag="a"
                                    onClick={() => {
                                      setDeliverableInfo(i);
                                      setEditModalStatus(true);
                                    }}
                                  >
                                    Submit
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

export default Deliverable;
