import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { useFormik } from "formik";
import Modal, {
  ModalBody,
  ModalFooter,
  ModalHeader,
  ModalTitle,
} from "../../../components/bootstrap/Modal";
import showNotification from "../../../components/extras/showNotification";
import Icon from "../../../components/icon/Icon";

import Select from "../../../components/bootstrap/forms/Select";
import axios from "axios";

//////////////////////

import FormGroup from "../../../components/bootstrap/forms/FormGroup";
import Input from "../../../components/bootstrap/forms/Input";

import Button from "../../../components/bootstrap/Button";
import SweetAlert from "react-bootstrap-sweetalert";

const TeacherAddModal = ({ id, isOpen, setIsOpen, reload }) => {
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
    };
  }


  const addToDatabase = async (val) => {
    console.log("ADD Teacher!!!!", val);

    const Name = val.name;
    const Password = val.password;
    const Email = val.email;
    const PhoneNumber = val.phonenumber;
    const Gender = val.gender;
    const Designation = val.designation;
    const isSupervisor = true;
    const isCommittee = false;
    const ProfilePicture = getFileBase64String;


    try {
      await axios.post(
        "http://localhost:3500/admin/teacher",
        {
          Name,
          Password,
          Email,
          PhoneNumber,
          Gender,
          Designation,
          isSupervisor,
          isCommittee,
          ProfilePicture,
        },
        {
          withCredentials: true,
        }
      );

      setIsOpen(false);
      showNotification(
        <span className="d-flex align-items-center">
          <Icon icon="Info" size="lg" className="me-1" />
          <span>Teacher Added Successfully</span>
        </span>,
        "Teacher has been added successfully"
      );

    }
    catch (e) {
      setErrorModal(true)


    }

    reload();
  };

  function isEmail(val) {
    return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(val);
  }

  function isPhoneNumber(val) {
    return /^((\+92)?(0092)?(92)?(0)?)(3)([0-9]{9})$/gm.test(val);
  }

  function isPassword(val) {
    return /^.{4,15}$/.test(val);
  }

  function isRegNo(val) {
    return /[A-Za-z0-9]+-[a-zA-Z]+([+-]?(?=\.\d|\d)(?:\d+)?(?:\.?\d*))(?:[eE]([+-]?\d+))?/i.test(val);
  }



  const validate = (values) => {
    const errors = {};

    if (!values.name) {
      errors.name = 'Required';
    }
    if (!values.designation) {
      errors.designation = 'Required';
    } else if (values.designation.length > 10) {
      errors.designation = 'Must be 10 characters or less';
    }

    if (!isEmail(values.email)) {
      errors.email = 'Email not valid';

    }

    if (!isRegNo(values.regno)) {
      errors.regno = 'RegNo not valid';

    }

    if (!isPhoneNumber(values.phonenumber)) {
      errors.phonenumber = 'Phone Number not valid';

    }

    if (!isPassword(values.password)) {
      errors.password = 'Password not valid. Must have 4-15 characters';

    }

    if (values.gender) {
      errors.gender = 'Gender must be selected';

    }


    return errors;
  };






  const formik = useFormik({
    initialValues: {
      name: "",
      password: "",
      email: "",
      phonenumber: "",
      gender: "",
      designation: "",
      isSupervisor: "",
      isCommittee: "",
      ProfilePicture: ""
    },
    // eslint-disable-next-line no-unused-vars
    validate,

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
          <ModalTitle id={id}>{"Add Teacher"}</ModalTitle>
        </ModalHeader>
        <ModalBody className="px-4">
          <div className="row g-4">
            <FormGroup
              className="col-lg-6"
              id="designation"
              label="Designation"
            >
              <Input
                required
                placeholder="Designation"
                autoComplete="honorific-prefix"
                onChange={formik.handleChange}
                value={formik.values.designation}


                isValid={formik.isValid}
                isTouched={formik.touched.designation}
                invalidFeedback={formik.errors.designation}
                validFeedback='Looks good!'
                onBlur={formik.handleBlur}

              />
            </FormGroup>
            <FormGroup className="col-lg-6" id="name" label="Name">
              <Input
                required
                placeholder="Name"
                autoComplete="given-name"
                onChange={formik.handleChange}
                value={formik.values.name}


                isValid={formik.isValid}
                isTouched={formik.touched.name}
                invalidFeedback={formik.errors.name}
                validFeedback='Looks good!'
                onBlur={formik.handleBlur}
              />
            </FormGroup>
            <FormGroup className="col-lg-6" id="password" label="Password">
              <Input
                required
                placeholder="******"
                autoComplete="additional-name"
                onChange={formik.handleChange}
                value={formik.values.password}



                isValid={formik.isValid}
                isTouched={formik.touched.password}
                invalidFeedback={formik.errors.password}
                validFeedback='Looks good!'
                onBlur={formik.handleBlur}
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



                isValid={formik.isValid}
                isTouched={formik.touched.gender}
                invalidFeedback={formik.errors.gender}
                validFeedback='Looks good!'
                onBlur={formik.handleBlur}
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



                isValid={formik.isValid}
                isTouched={formik.touched.email}
                invalidFeedback={formik.errors.email}
                validFeedback='Looks good!'
                onBlur={formik.handleBlur}
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



                isValid={formik.isValid}
                isTouched={formik.touched.phonenumber}
                invalidFeedback={formik.errors.phonenumber}
                validFeedback='Looks good!'
                onBlur={formik.handleBlur}
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
            Add Teacher
          </Button>
        </ModalFooter>
      </Modal>
    );
  }
  return null;
};
TeacherAddModal.propTypes = {
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  isOpen: PropTypes.bool.isRequired,
  setIsOpen: PropTypes.func.isRequired,
};

export default TeacherAddModal;
