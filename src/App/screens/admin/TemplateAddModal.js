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



const TemplateAddModal = ({ id, isOpen, setIsOpen }) => {



  const addToDatabase = async (val) => {
    console.log("ADD Template!!!!", val);

    const Title = val.title;
    const DateModified = val.datemodified;
    const Deadline = val.deadline;
    const File = val.file;
   
    await axios.post(
      "http://localhost:3500/admin/template",
      {
        Title,
        DateModified,
        Deadline,
        File      
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
        "http://localhost:4000/template/getTemplates"
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
      title: "",
      datemodified: "",
      deadline: "",
      file: ""
    },
    // eslint-disable-next-line no-unused-vars

    validateOnChange: false,
    validateOnBlur: false,
    onSubmit: (values) => {
      console.log("VALUES: ", values);
      addToDatabase(values);
      setflipState(!flipState);

      setIsOpen(false);
      showNotification(
        <span className="d-flex align-items-center">
          <Icon icon="Info" size="lg" className="me-1" />
          <span>Template Added Successfully</span>
        </span>,
        "Template has been added successfully"
      );
    },
  });

  if (id || id === 0) {
    return (
      <Modal isOpen={isOpen} setIsOpen={setIsOpen} size="xl" titleId={id}>
        <ModalHeader setIsOpen={setIsOpen} className="p-4">
          <ModalTitle id={id}>{"Add Template"}</ModalTitle>
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
            <FormGroup className="col-lg-6" id="deadline" label="Deadline">
              <Input
                required
                placeholder="Deadline"
                autoComplete="given-name"
                onChange={formik.handleChange}
                value={formik.values.deadline}
              />
            </FormGroup>
        
                   

            <FormGroup className="col-12" id="formFile" label="Upload File">
              <Input
                required
                type="file"
                onChange={formik.handleChange}
                value={formik.values.file}
              />
            </FormGroup>
          </div>
        </ModalBody>
        <ModalFooter className="px-4 pb-4">
          <Button color="info" onClick={formik.handleSubmit}>
            Add Template
          </Button>
        </ModalFooter>
      </Modal>
    );
  }
  return null;
};
TemplateAddModal.propTypes = {
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  isOpen: PropTypes.bool.isRequired,
  setIsOpen: PropTypes.func.isRequired,
};

export default TemplateAddModal;
