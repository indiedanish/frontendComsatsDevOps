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

//////////////////////

import FormGroup from "../../../components/bootstrap/forms/FormGroup";
import Input from "../../../components/bootstrap/forms/Input";

import Button from "../../../components/bootstrap/Button";

/////////////////////////////

const AnnouncementEditModal = ({ id, isOpen, setIsOpen, announcementInfo,reload }) => {


    const [announcement, setAnnouncement] = useState(announcementInfo);



  const addToDatabase = async (val) => {
    console.log("Edit Announcement!!!!", val);


    const Title = val.title;
    const Description = val.description;


    await axios.put(
      "http://localhost:3500/admin/announcement",
      {
        Title : `${announcementInfo.Title}`,
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
        "http://localhost:4000/announcement/getAnnouncements"
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
      description: "",

     
     
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
          <span>Announcement Updated Successfully</span>
        </span>,
        "Announcement has been updated successfully"
      );
    },
  });
 
  if (id || id === 0) {
    return (
      <Modal isOpen={isOpen} setIsOpen={setIsOpen} size="xl" titleId={id}>
        <ModalHeader setIsOpen={setIsOpen} className="p-4">
          <ModalTitle id={id}>{"Edit Announcement: "+ announcementInfo.Title}</ModalTitle>
        </ModalHeader>
        <ModalBody className="px-4">
          <div className="row g-4">
                 
          

            <FormGroup className="col-lg-6" id="title" label="Title">
              <Input
                disabled
                type="title"
                autoComplete="title"
                onChange={formik.handleChange}
                defaultValue={`${announcementInfo.Title}`}
                value={`${announcementInfo.Title}`}


              />
            </FormGroup>

            <FormGroup
              className="col-lg-12"
              id="description"
              label="Description"
            >
              <Input
              
                defaultValue={`${announcementInfo.Description}`}
                autoComplete="description"
                onChange={formik.handleChange}
              />
            </FormGroup>

     
          </div>
        </ModalBody>
        <ModalFooter className="px-4 pb-4">
          <Button color="info" onClick={formik.handleSubmit}>
            Edit Announcement
          </Button>
        </ModalFooter>
      </Modal>
    );
  }
  return null;
};
AnnouncementEditModal.propTypes = {
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  isOpen: PropTypes.bool.isRequired,
  setIsOpen: PropTypes.func.isRequired,
};

export default AnnouncementEditModal;
