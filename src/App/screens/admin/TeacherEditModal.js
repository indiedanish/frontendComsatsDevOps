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

const TeacherEditModal = ({ id, isOpen, setIsOpen, teacherInfo ,reload}) => {
  // const itemData = id ? data.filter((item) => item.id.toString() === id.toString()) : {};
  // const item = id ? itemData[0] : {};

    const [teacher, setTeacher] = useState(teacherInfo);

  const [invalidEmail, setInvalidEmail] = useState(false);


  
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
    console.log("Edit Teacher!!!!", val);


    const Name = val.name;
    const Password = val.password;
    const PhoneNumber = val.phonenumber;
    const Gender = val.gender;
    const Designation = val.designation;
    const isSupervisor = true;
    const isCommittee= false;

    const ProfilePicture = getFileBase64String;

    await axios.put(
      "http://localhost:3500/admin/teacher",
      {
        Name,
        Password,
        Email : `${teacherInfo.Email}`,
        PhoneNumber,
        Gender,
        Designation,
        isSupervisor,
        isCommittee,
        ProfilePicture
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
      isCommittee: "",
      ProfilePicture: "",

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
          <span>Teacher Updated Successfully</span>
        </span>,
        "Teacher has been updated successfully"
      );
    },
  });
 
  if (id || id === 0) {
    return (
      <Modal isOpen={isOpen} setIsOpen={setIsOpen} size="xl" titleId={id}>
        <ModalHeader setIsOpen={setIsOpen} className="p-4">
          <ModalTitle id={id}>{"Edit Teacher: "+ teacherInfo.Email}</ModalTitle>
        </ModalHeader>
        <ModalBody className="px-4">
          <div className="row g-4">
            <FormGroup className="col-lg-6" id="designation" label="Designation">
              <Input
                autoComplete="honorific-prefix"
                onChange={formik.handleChange}
                defaultValue={`${teacherInfo.Designation}`}

              />
            </FormGroup>
            <FormGroup className="col-lg-6" id="name" label="Name">
              <Input
                required
                autoComplete="given-name"
                defaultValue={`${teacherInfo.Name}`}
                onChange={formik.handleChange}
              />
            </FormGroup>
            <FormGroup className="col-lg-6" id="password" label="Password">
              <Input
                required
                defaultValue={`${teacherInfo.Password}`}
                autoComplete="additional-name"
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
                defaultValue={`${teacherInfo.Gender}`}
                onChange={formik.handleChange}
                list={[
                  { value: false, text: "Male" },
                  { value: true, text: "Female" },
                ]}
              />
            </FormGroup>

            <FormGroup className="col-lg-6" id="email" label="Email Address">
              <Input
                disabled
                type="email"
                autoComplete="email"
                onChange={formik.handleChange}
                defaultValue={`${teacherInfo.Email}`}
                value={`${teacherInfo.Email}`}

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
                defaultValue={`${teacherInfo.PhoneNumber}`}
                autoComplete="tel"
                onChange={formik.handleChange}
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
            Edit Teacher
          </Button>
        </ModalFooter>
      </Modal>
    );
  }
  return null;
};
TeacherEditModal.propTypes = {
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  isOpen: PropTypes.bool.isRequired,
  setIsOpen: PropTypes.func.isRequired,
};

export default TeacherEditModal;
