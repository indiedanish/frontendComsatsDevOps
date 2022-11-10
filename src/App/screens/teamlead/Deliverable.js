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
import Swal from "sweetalert2";

const Deliverable = () => {
  // const [getProjectDeliverables, setgetProjectDeliverables] = useState([]);
  const [deliverablesStatuses, setDeliverablesStatuses] = useState([
    false,
    false,
    false,
    false,
  ]);


  const [studentInfo, setStudentInfo] = useState([]);

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
    setStudentInfo(response)
    getprojectdeliverables(response);


  };

  const setStatuses = async (deliverables) => {
    console.log("deliverables of projects: ", deliverablesStatuses, " DATA deliverables", deliverables.data);


    const temp = deliverablesStatuses.map((i, k) => {

      console.log(k);
      if (deliverables.data[k] == undefined) { console.log("undefined"); return }
      else if (deliverables.data[k].Title == "Scope") { deliverablesStatuses[0] = true; console.log("0"); return }
      else if (deliverables.data[k].Title == "SDS") { deliverablesStatuses[1] = true; console.log("1"); return }
      else if (deliverables.data[k].Title == "Testing") { deliverablesStatuses[2] = true; console.log("2"); return }
      else if (deliverables.data[k].Title == "Final") { deliverablesStatuses[3] = true; console.log("3"); return }
      else return false

    });

    var temp2 = deliverablesStatuses.map((i, k) => i)
    setDeliverablesStatuses(temp2)

    console.log("temp2: ", temp2);

    return

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

      setStatuses(response);

      console.log("IM PROJECT DELIVERAABLE", response.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getstudentSelf();;
    getAllDeliverable();
  }, []);

  const { darkModeStatus } = useDarkMode();

  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(PER_COUNT["10"]);

  const [allDeliverable, setAllDeliverable] = useState([]);


  const [status, setStatus] = useState(false)

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

  const [files, setFiles] = useState(["", "", "", ""])

  const [getFileBase64String, setFileBase64String] = useState(["", "", "", ""])
  const encodeFileBase64 = (file, title) => {

    console.log("YOU KNOWIM ITLE", title)
    //push files to array 
    if (title == "Scope") {
      files[0] = "Scope"
    }
    else if (title == "SDS") {
      files[1] = "SDS"
    }
    else if (title == "Testing") {
      files[2] = "Testing"
    }
    else if (title == "Final") {
      files[3] = "Final"
    }

    console.log("IM BASE 64 array: ", getFileBase64String, " IM FILE array: ", files)


    var reader = new FileReader();
    console.log("\nfile", file);

    reader.readAsDataURL(file);

    reader.onload = () => {
      var Base64 = reader.result;
      console.log("Base64", Base64);
      if (title == "Scope") {
        getFileBase64String[0] = Base64
      }
      else if (title == "SDS") {
        getFileBase64String[1] = Base64
      }
      else if (title == "Testing") {
        getFileBase64String[2] = Base64
      }
      else if (title == "Final") {
        getFileBase64String[3] = Base64
      }

    };


  };


  const addToDatabase = async (title) => {

    console.log("ADD TO DATABASE")

    var filetoBeSent = ""

    if (title == "Scope") {
      filetoBeSent = getFileBase64String[0]
    }
    else if (title == "SDS") {
      filetoBeSent = getFileBase64String[1]
    }
    else if (title == "Testing") {
      filetoBeSent = getFileBase64String[2]
    }
    else if (title == "Final") {
      filetoBeSent = getFileBase64String[3]
    }

    if (filetoBeSent=="") {
      Swal.fire('Please choose file', '', 'error')
        return
    }

    try { if (status == false){
      const res = await axios.post(
        "http://localhost:3500/student/deliverable",
        {
          Title: title,
          File: filetoBeSent,
          ProjectName: studentInfo.data.Project.Name,
          Status: true

        },
        {
          withCredentials: true,
        }
      );
    }
    else{

      const res = await axios.put(
      "http://localhost:3500/student/deliverable",
      {
        Title: title,
        File: filetoBeSent,
        ProjectName: studentInfo.data.Project.Name,

      },
      {
        withCredentials: true,
      }
    );

    }

      Swal.fire('Submitted!', '', 'success')

    }
    catch (err) {
      console.log(err)
      Swal.fire('Network Error', '', 'error')
    }

  }



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
                      <th
                        onClick={() => requestSort("DateModified")}
                        className="cursor-pointer text-decoration-underline"
                      >
                        Choose File
                        <Icon
                          size="lg"
                          className={getClassNamesFor("Status")}
                          icon="FilterList"
                        />
                      </th>
                      <th className="cursor-pointer">Actions </th> <td />
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

                          <td>
                            {new Date(i.Deadline).toLocaleString(
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
                          </td>
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

                            {
                              deliverablesStatuses[key] == false ? ( 
                                <div className="flex justify-center text-center items-center">
                                  <Icon
                                    className='flex'
                                    icon='Circle'
                                    color="danger"
                                  />
                                  <div className="text-danger flex ml-3">Not Submitted </div>
                                </div>) :

                                (<div className="flex justify-center text-center items-center">
                                  <Icon
                                    className='flex'
                                    icon='Circle'
                                    color="success"
                                  />
                                  <div className="text-success flex ml-3">Submitted </div>
                                </div>)
                            }
                          </td>

                          <td>
                            <Input
                              required
                              type="file"
                              onChange={(e) => {
                                deliverablesStatuses[key] == false ? (setStatus(false)) : (setStatus(true))
                                encodeFileBase64(e.target.files[0], i.Title);
                              }}
                            />
                          </td>

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
                                      addToDatabase(i.Title)
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