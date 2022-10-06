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

/////////////////////////////

const TemplateEditModal = ({ id, isOpen, setIsOpen, templateInfo,reload }) => {


    const [template, setTemplate] = useState(templateInfo);


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
    console.log("Edit Template!!!!", val);


    const Title = val.title;
    const Deadline = val.deadline;
    const File = val.file;
    const Description = val.description;



    await axios.put(
      "http://localhost:3500/admin/template",
      {
        Title : `${templateInfo.Title}`,
        Deadline,
        File,
        Description
      },
      {
        withCredentials: true,
      }
    );
    reload()
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
      file: "",
      dateModified: "",
      deadline: "",
     
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
          <span>Template Updated Successfully</span>
        </span>,
        "Template has been updated successfully"
      );
    },
  });
 
  if (id || id === 0) {
    return (
      <Modal isOpen={isOpen} setIsOpen={setIsOpen} size="xl" titleId={id}>
        <ModalHeader setIsOpen={setIsOpen} className="p-4">
          <ModalTitle id={id}>{"Edit Template: "+ templateInfo.Title}</ModalTitle>
        </ModalHeader>
        <ModalBody className="px-4">
          <div className="row g-4">
                 
          

            <FormGroup className="col-lg-6" id="title" label="Title">
              <Input
                disabled
                type="title"
                autoComplete="title"
                onChange={formik.handleChange}
                defaultValue={`${templateInfo.Title}`}
                value={`${templateInfo.Title}`}


              />
            </FormGroup>

            <FormGroup
              className="col-lg-6"
              id="deadline"
              label="Deadline"
            >
              <Input
              
                type="date"
                defaultValue={`${templateInfo.Deadline}`}
                autoComplete="date"
                onChange={formik.handleChange}
              />
            </FormGroup>

            <FormGroup
              className="col-lg-12"
              id="description"
              label="Description"
            >
              <Input
              
                defaultValue={`${templateInfo.Description}`}
                autoComplete="description"
                onChange={formik.handleChange}
              />
            </FormGroup>

            <FormGroup className="col-12" id="formFile" label="Upload File">
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
            Edit Template
          </Button>
        </ModalFooter>
      </Modal>
    );
  }
  return null;
};
TemplateEditModal.propTypes = {
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  isOpen: PropTypes.bool.isRequired,
  setIsOpen: PropTypes.func.isRequired,
};

export default TemplateEditModal;
