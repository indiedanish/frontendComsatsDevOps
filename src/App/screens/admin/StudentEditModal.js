import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { useFormik } from "formik";
import moment from "moment";
import Modal, {
  ModalBody,
  ModalFooter,
  ModalHeader,
  ModalTitle,
} from "../../../components/bootstrap/Modal";
import data from "../../../common/data/dummyCustomerData";
import showNotification from "../../../components/extras/showNotification";
import Icon from "../../../components/icon/Icon";

import Label from "../../../components/bootstrap/forms/Label";
import Checks, {
  ChecksGroup,
} from "../../../components/bootstrap/forms/Checks";
import PAYMENTS from "../../../common/data/enumPaymentMethod";
import Select from "../../../components/bootstrap/forms/Select";
import Option from "../../../components/bootstrap/Option";
import axios from "axios";

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

/////////////////////////////

const StudentEditModal = ({ id, isOpen, setIsOpen, studentInfo }) => {
  // const itemData = id ? data.filter((item) => item.id.toString() === id.toString()) : {};
  // const item = id ? itemData[0] : {};

    const [student, setStudent] = useState(studentInfo);

  const [invalidEmail, setInvalidEmail] = useState(false);

  const addToDatabase = async (val) => {
    console.log("ADD STUDENT!!!!", val);

    const RegNo = val.regno;
    const Name = val.name;
    const Password = val.password;
    const Email = val.email;
    const PhoneNumber = val.phonenumber;
    const Gender = val.gender;
    const Role = "TeamMember";
    const FypStatus = "Scope";

    await axios.put(
      "http://localhost:3500/admin/student",
      {
        RegNo : `${studentInfo.RegNo}`,
        Name,
        Password,
        Email,
        PhoneNumber,
        Gender,
        Role,
        FypStatus,
      },
      {
        withCredentials: true,
      }
    );
  };

  var [use, setuse] = useState([]);
  var [selectedMembersID, setselectedMembersID] = useState([]);
  var [selectedMembersName, setselectedMembersName] = useState([]);
  var [flipState, setflipState] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const response = await axios.get(
        "http://localhost:4000/student/getStudents"
      );
      console.log("ssss", response.data);
      setuse(response.data);
      setselectedMembersID([]);
      setselectedMembersName([]);
    };

    // call the function
    fetchData();
  }, [flipState, isOpen]);

  console.log("USERS: ", use);

  const formik = useFormik({
    initialValues: {
      regno: "",
      name: "",
      password: "",
      email: "",
      phonenumber: "",
      gender: "",
      fypstatus: "Scope",
    },

    validateOnChange: true,
    validateOnBlur: true,
    onSubmit: (values) => {
      console.log("VALUES: ", values);
      addToDatabase(values);
      setflipState(!flipState);

      setIsOpen(false);
      showNotification(
        <span className="d-flex align-items-center">
          <Icon icon="Info" size="lg" className="me-1" />
          <span>Student Added Successfully</span>
        </span>,
        "Student has been added successfully"
      );
    },
  });
 
  if (id || id === 0) {
    return (
      <Modal isOpen={isOpen} setIsOpen={setIsOpen} size="xl" titleId={id}>
        <ModalHeader setIsOpen={setIsOpen} className="p-4">
          <ModalTitle id={id}>{"Edit Student: "+ studentInfo.RegNo}</ModalTitle>
        </ModalHeader>
        <ModalBody className="px-4">
          <div className="row g-4">
            <FormGroup className="col-lg-6" id="regno" label="Registration No">
              <Input
              disabled
                autoComplete="honorific-prefix"
                defaultValue={`${studentInfo.RegNo}`}
                onChange={formik.handleChange}
                value={`${studentInfo.RegNo}`}

              />
            </FormGroup>
            <FormGroup className="col-lg-6" id="name" label="Name">
              <Input
                required


                autoComplete="given-name"
                defaultValue={`${studentInfo.Name}`}
                onChange={formik.handleChange}

              />
            </FormGroup>
            <FormGroup className="col-lg-6" id="password" label="Password">
              <Input
                required
                autoComplete="additional-name"
                defaultValue={`${studentInfo.Password}`}
                onChange={formik.handleChange}
              />
            </FormGroup>
            <FormGroup
              id="gender"
              label="Please select gender"
              className="col-lg-6"
            >
              <Select
                required
                ariaLabel="Gender"
                placeholder={`${studentInfo.Gender?"Male":"Female" }`}
                defaultValue={`${studentInfo.Gender}`}
                onChange={formik.handleChange}

                list={[
                  { value: false, text: "Male" },
                  { value: true, text: "Female" },
                ]}
              />
            </FormGroup>

            <FormGroup className="col-lg-6" id="email" label="Email Address">
              <Input
                required
                type="email"
                defaultValue={`${studentInfo.Email}`}

                autoComplete="email"
                onChange={formik.handleChange}
                // onBlur={(e)=>{

                //     const check = String(e.target.value)
                //     .toLowerCase()
                //     .match(
                //       /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
                //     );

                //     if(check==null) setInvalidEmail(false)
                //     else return

                // }

                // }
              />
            </FormGroup>

            <FormGroup
              className="col-lg-6"
              id="phonenumber"
              label="Phone Number"
            >
              <Input
                required
                type="tel"
                autoComplete="tel"
                onChange={formik.handleChange}            
                defaultValue={`${studentInfo.PhoneNumber}`}
              />
            </FormGroup>

            <FormGroup className="col-12" id="formFile" label="Profile picture">
              <Input
                required
                type="file"
                onChange={formik.handleChange}
                value={formik.values.formFile}
              />
            </FormGroup>
          </div>
        </ModalBody>
        <ModalFooter className="px-4 pb-4">
          <Button color="info" onClick={formik.handleSubmit}>
            Edit Student
          </Button>
        </ModalFooter>
      </Modal>
    );
  }
  return null;
};
StudentEditModal.propTypes = {
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  isOpen: PropTypes.bool.isRequired,
  setIsOpen: PropTypes.func.isRequired,
};

export default StudentEditModal;
