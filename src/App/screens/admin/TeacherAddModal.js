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



const TeacherAddModal = ({ id, isOpen, setIsOpen }) => {



  const addToDatabase = async (val) => {
    console.log("ADD Teacher!!!!", val);

    const Name = val.name;
    const Password = val.password;
    const Email = val.email;
    const PhoneNumber = val.phonenumber;
    const Gender = val.gender;
    const Designation = val.designation;
    const isSupervisor = true;
    const isCommittee= false;
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
        isCommittee
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
        "http://localhost:4000/teacher/getTeachers"
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
      name: "",
      password: "",
      email: "",
      phonenumber: "",
      gender: "",
      designation: "",
      isSupervisor: "",
      isCommittee: ""
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
          <span>Teacher Added Successfully</span>
        </span>,
        "Teacher has been added successfully"
      );
    },
  });

  if (id || id === 0) {
    return (
      <Modal isOpen={isOpen} setIsOpen={setIsOpen} size="xl" titleId={id}>
        <ModalHeader setIsOpen={setIsOpen} className="p-4">
          <ModalTitle id={id}>{"Add Teacher"}</ModalTitle>
        </ModalHeader>
        <ModalBody className="px-4">
          <div className="row g-4">
            <FormGroup className="col-lg-6" id="designation" label="Designation">
              <Input
                required
                placeholder="Designation"
                autoComplete="honorific-prefix"
                onChange={formik.handleChange}
                value={formik.values.designation}
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
