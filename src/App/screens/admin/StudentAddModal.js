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
import SweetAlert from 'react-bootstrap-sweetalert';

import FormGroup from "../../../components/bootstrap/forms/FormGroup";
import Input from "../../../components/bootstrap/forms/Input";

import Button from "../../../components/bootstrap/Button";



const StudentAddModal = ({ id, isOpen, setIsOpen, reload }) => {




  const [errorModal, setErrorModal] = useState(false);


  const [getFileBase64String, setFileBase64String] = useState(false);


  const encodeFileBase64 = (file) => {
    var reader = new FileReader();
    console.log("\nfile", file);

    reader.readAsDataURL(file);
    reader.onload = () => {
      var Base64 = reader.result;
      console.log("Base64", Base64);
      setFileBase64String(Base64);
    };}



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
    const ProfilePicture = getFileBase64String;


    try {
      const resposne = await axios.post(
        "http://localhost:3500/admin/student",
        {
          RegNo,
          Name,
          Password,
          Email,
          PhoneNumber,
          Gender,
          Role,
          FypStatus,
          ProfilePicture
        },
        {
          withCredentials: true,
        }
      );

      setIsOpen(false);
      showNotification(
        <span className="d-flex align-items-center">
          <Icon icon="Info" size="lg" className="me-1" />
          <span>Student Added Successfully</span>
        </span>,
        "Student has been added successfully"
      );
    }
    catch (err) {
      console.log("Status", err.response.status);
      console.log("errorModal", errorModal);
      setErrorModal(true);

    }

    reload()



  };


  const formik = useFormik({
    initialValues: {
      regno: "",
      name: "",
      password: "",
      email: "",
      phonenumber: "",
      gender: "",
      fypstatus: "Scope",
      ProfilePicture: "",

    },
    // eslint-disable-next-line no-unused-vars

    validateOnChange: false,
    validateOnBlur: false,
    onSubmit: (values) => {
      console.log("VALUES: ", values);
      addToDatabase(values);




    },
  });

  if (id || id === 0) {
    return (
      <Modal isOpen={isOpen} setIsOpen={setIsOpen} size="xl" titleId={id}>
        {errorModal ? (
          <SweetAlert
            error
            confirmBtnBsStyle="primary"
            title="Invalid Details"
            onConfirm={() => setErrorModal(false)}
          >
            Please enter correct details
          </SweetAlert>
        ) : (
          ""
        )}

        <ModalHeader setIsOpen={setIsOpen} className="p-4">
          <ModalTitle id={id}>{"Add Student"}</ModalTitle>
        </ModalHeader>
        <ModalBody className="px-4">
          <div className="row g-4">
            <FormGroup className="col-lg-6" id="regno" label="Registration No">
              <Input
                required
                placeholder="Reg No"
                autoComplete="honorific-prefix"
                onChange={formik.handleChange}
                value={formik.values.regno}
              />
            </FormGroup>
            <FormGroup className="col-lg-6" id="name" label="Name">
              <Input
                required
                placeholder="Name"
                autoComplete="given-name"
                onChange={formik.handleChange}
                value={formik.values.name}
              />
            </FormGroup>
            <FormGroup className="col-lg-6" id="password" label="Password">
              <Input
                required
                placeholder="******"
                autoComplete="additional-name"
                onChange={formik.handleChange}
                value={formik.values.password}
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
                placeholder="Select Gender"
                onChange={formik.handleChange}
                value={formik.values.gender}
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
                placeholder="Email Address"
                autoComplete="email"
                onChange={formik.handleChange}
                value={formik.values.email}
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
                placeholder="Phone Number"
                autoComplete="tel"
                onChange={formik.handleChange}
                value={formik.values.phonenumber}
              />
            </FormGroup>

            <FormGroup className="col-12" id="formFile" label="Profile Picture">
                <Input
                  required
                  type="file"
                  onChange={(e) => {
                    encodeFileBase64(e.target.files[0]);
                  }}
                />
              </FormGroup>
          </div>
        </ModalBody>
        <ModalFooter className="px-4 pb-4">
          <Button color="info" onClick={formik.handleSubmit}>
            Add Student
          </Button>
        </ModalFooter>
      </Modal>
    );
  }
  return null;
};
StudentAddModal.propTypes = {
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  isOpen: PropTypes.bool.isRequired,
  setIsOpen: PropTypes.func.isRequired,
};

export default StudentAddModal;
