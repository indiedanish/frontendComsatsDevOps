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
import { Description } from "@material-ui/icons";

axios.defaults.withCredentials = true;
import useAuth from "../../../hooks/useAuth";
import Swal from "sweetalert2";



const ProjectAddModal = ({ id, isOpen, setIsOpen, reload, allStudents }) => {



  const [errorModal, setErrorModal] = useState(false);




  function isRegNo(val) {
    return /[A-Za-z0-9]+-[a-zA-Z]+([+-]?(?=\.\d|\d)(?:\d+)?(?:\.?\d*))(?:[eE]([+-]?\d+))?/i.test(val);
  }



  const validate = (values) => {
    const errors = {};
    if (!values.TeamLeader) {
      errors.TeamLeader = 'Required';
    } else if (values.TeamLeader.length > 15) {
      errors.TeamLeader = 'Must be 15 characters or less';
    }






    // if (!values.validationLastName) {
    //   errors.validationLastName = 'Required';
    // } else if (values.validationLastName.length > 20) {
    //   errors.validationLastName = 'Must be 20 characters or less';
    // }

    // if (!values.validationCustomUsername) {
    //   errors.validationCustomUsername = 'Required';
    // } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.validationCustomUsername)) {
    //   errors.validationCustomUsername = 'Invalid email address';
    // }

    // if (!values.validationCity) {
    //   errors.validationCity = 'Please provide a valid city.';
    // }

    // if (!values.validationState) {
    //   errors.validationState = 'Please select a valid state.';
    // }

    // if (!values.validationZip) {
    //   errors.validationZip = 'Please provide a valid zip.';
    // } else if (values.validationZip.length !== 5) {
    //   errors.validationZip = 'Must be 5 characters';
    // }

    // if (!values.validationDesc) {
    //   errors.validationDesc = 'Please provide a valid Desc.';
    // } else if (values.validationDesc.length < 20) {
    //   errors.validationDesc = `Must be 20 characters or more, but currently ${values.validationDesc.length} characters`;
    // }

    // if (!values.validationRadios) {
    //   errors.validationRadios = 'You must choose one before posting.';
    // }

    // if (!values.validationCheck) {
    //   errors.validationCheck = 'You must agree before submitting.';
    // }

    return errors;
  };

  const { auth, setAuth } = useAuth();

  console.log("ASDASDASD", allStudents);


  const addToDatabase = async (val) => {
    console.log("ADD Project!!!!", val);

    const Name = val.name;
    const GroupSupervisor = auth.Email;
    const Description = val.description;
    const TeamLeader = val.TeamLeader;




    try {
      const resposne = await axios.post(
        "http://localhost:3500/teacher/project",
        {
          Name,
          GroupSupervisor,
          Description,
          TeamLeader
        },
        {
          withCredentials: true,
        }
      );
      Swal.fire('Successfully Added!', '', 'success')

      setIsOpen(false);
      showNotification(
        <span className="d-flex align-items-center">
          <Icon icon="Info" size="lg" className="me-1" />
          <span>Project Added Successfully</span>
        </span>,
        "Project has been added successfully"
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
      name: "",
      description: "",
      TeamLeader: "",
      GroupSupervisor: ""

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
          <ModalTitle id={id}>{"Add Project"}</ModalTitle>
        </ModalHeader>
        <ModalBody className="px-4">
          <div className="row g-4">

            <FormGroup className="col-lg-6" id="name" label="Project Name">
              <Input
                required
                placeholder="Name"
                autoComplete="given-name"
                onChange={formik.handleChange}
                value={formik.values.name}
              />
            </FormGroup>

            <FormGroup className="col-lg-6" id="TeamLeader" label="Team Lead Reg#">
              {/* <Input
                required
                placeholder="Reg No"
                autoComplete="honorific-prefix"
                onChange={formik.handleChange}
                value={formik.values.TeamLeader}


                isValid={formik.isValid}
                isTouched={formik.touched.TeamLeader}
                invalidFeedback={formik.errors.TeamLeader}
                validFeedback='Looks good!'
                onBlur={formik.handleBlur}

              /> */}


              <Select
                required
                ariaLabel="Team Lead"
                placeholder="Select Team Lead"
                onChange={formik.handleChange}
                value={formik.values.TeamLeader}


              >
                {allStudents.map((student) => (<Option value={student.RegNo}>{`${student.Name}`}</Option>))}


              </Select>
            </FormGroup>

            <FormGroup className="col-lg-12" id="description" label="Project Description">
              <Input
                required
                placeholder="Description"
                autoComplete="given-name"
                onChange={formik.handleChange}
                value={formik.values.description}
              />
            </FormGroup>

          </div>
        </ModalBody>
        <ModalFooter className="px-4 pb-4">
          <Button color="info" onClick={formik.handleSubmit}>
            Add Project
          </Button>
        </ModalFooter>
      </Modal>
    );
  }
  return null;
};
ProjectAddModal.propTypes = {
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  isOpen: PropTypes.bool.isRequired,
  setIsOpen: PropTypes.func.isRequired,
};

export default ProjectAddModal;
