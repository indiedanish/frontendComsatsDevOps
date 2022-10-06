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

const AnnouncementAddModal = ({ id, isOpen, setIsOpen, reload }) => {
  const [errorModal, setErrorModal] = useState(false);

  const addToDatabase = async (val) => {
    console.log("ADD Announcement!!!!", val);

    const Title = val.title;
     const Description = val.description;

    try {
      await axios.post(
        "http://localhost:3500/admin/announcement",
        {
          Title,
          Description,
        },
        {
          withCredentials: true,
        }
      );

      setIsOpen(false);
      showNotification(
        <span className="d-flex align-items-center">
          <Icon icon="Info" size="lg" className="me-1" />
          <span>Announcement Added Successfully</span>
        </span>,
        "Announcement has been added successfully"
      );
    } catch (error) {
      setErrorModal(true);
    }

    reload();
  };




  const formik = useFormik({
    initialValues: {
      title: "",
      description: "",
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
          <ModalTitle id={id}>{"Add Announcement"}</ModalTitle>
        </ModalHeader>
        <ModalBody className="px-4">
          <div className="row g-4">
            <FormGroup className="col-lg-6" id="title" label="Title">
              <Input
                required
                placeholder="Title"
                autoComplete="honorific-prefix"
                onChange={formik.handleChange}
                value={formik.values.title}
              />
            </FormGroup>
         
            <FormGroup className="col-12" id="description" label="Description">
              <Input
                required
                onChange={formik.handleChange}
                value={formik.values.Description}
              />
            </FormGroup>
          
          </div>
        </ModalBody>
        <ModalFooter className="px-4 pb-4">
          <Button color="info" onClick={formik.handleSubmit}>
            Add Announcement
          </Button>
        </ModalFooter>
      </Modal>
    );
  }
  return null;
};
AnnouncementAddModal.propTypes = {
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  isOpen: PropTypes.bool.isRequired,
  setIsOpen: PropTypes.func.isRequired,
};

export default AnnouncementAddModal;
