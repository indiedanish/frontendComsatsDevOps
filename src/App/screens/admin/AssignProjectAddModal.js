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

import axios from "axios";

import SweetAlert from "react-bootstrap-sweetalert";

import FormGroup from "../../../components/bootstrap/forms/FormGroup";
import Input from "../../../components/bootstrap/forms/Input";

import Button from "../../../components/bootstrap/Button";

const AssignProjectAddModal = ({ id, isOpen, setIsOpen, reload }) => {
  const [errorModal, setErrorModal] = useState(false);
  const [getFileBase64String, setFileBase64String] = useState(false);


 


    const addToDatabase = async (val) => {

      const CommitteeName = val.committeeName;
      const ProjectName = val.projectName;
   

      try {
        await axios.put(
          "http://localhost:3500/admin/assignProjectCommittee",
          {
            CommitteeName,
            ProjectName
          
          },
          {
            withCredentials: true,
          }
        );

        setIsOpen(false);
        showNotification(
          <span className="d-flex align-items-center">
            <Icon icon="Info" size="lg" className="me-1" />
            <span>Project Assigned Successfully</span>
          </span>,
          "Project Assigned Successfully"
        );
      } catch (error) {
        setErrorModal(true);
      }

      reload();
    };




    const formik = useFormik({
      initialValues: {
        committeeName: "",
        projectName: ""
      },

      validateOnChange: false,
      validateOnBlur: false,
      onSubmit: (values) => {

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
            <ModalTitle id={id}>{"Add Details"}</ModalTitle>
          </ModalHeader>
          <ModalBody className="px-4">
            <div className="row g-4">
              <FormGroup className="col-lg-6" id="committeeName" label="Committee Name">
                <Input
                  required
                  placeholder="Committee Name"
                  autoComplete="honorific-prefix"
                  onChange={formik.handleChange}
                  value={formik.values.committeeName}
                />
              </FormGroup>
              <FormGroup className="col-lg-6" id="projectName" label="Project Name">
                <Input
                  required
                  placeholder="Project Name"
                  autoComplete="given-name"
                  onChange={formik.handleChange}
                  value={formik.values.projectName}
                />
              </FormGroup>

       

            
            </div>
          </ModalBody>
          <ModalFooter className="px-4 pb-4">
            <Button color="info" onClick={formik.handleSubmit}>
              Assign Project
            </Button>
          </ModalFooter>
        </Modal>
      );
    }
    return null;
  };
  AssignProjectAddModal.propTypes = {
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    isOpen: PropTypes.bool.isRequired,
    setIsOpen: PropTypes.func.isRequired,
  };

  export default AssignProjectAddModal;
