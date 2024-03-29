import React, { useCallback, useEffect, useState } from "react";
import { useFormik } from 'formik';
import moment from 'moment';
import PageWrapper from '../../../layout/PageWrapper/PageWrapper';
import { demoPages } from '../../../menu';
import SubHeader, {
  SubHeaderLeft,
  SubHeaderRight,
  SubheaderSeparator,
} from '../../../layout/SubHeader/SubHeader';
import Page from '../../../layout/Page/Page';
import validate from '../../../pages/presentation/demo-pages/helper/editPagesValidate';
import showNotification from '../../../components/extras/showNotification';
import Icon from '../../../components/icon/Icon';
import Card, {
  CardActions,
  CardBody,
  CardFooter,
  CardHeader,
  CardLabel,
  CardSubTitle,
  CardTitle,
} from '../../../components/bootstrap/Card';
import Button from '../../../components/bootstrap/Button';
import Dropdown, {
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
} from '../../../components/bootstrap/Dropdown';
import useDarkMode from '../../../hooks/useDarkMode';
import Spinner from '../../../components/bootstrap/Spinner';
import FormGroup from '../../../components/bootstrap/forms/FormGroup';
import Input from '../../../components/bootstrap/forms/Input';
import Breadcrumb from '../../../components/bootstrap/Breadcrumb';
import Avatar from '../../../components/Avatar';
import USERS from '../../../common/data/userDummyData';
import CommonDesc from '../../../components/common/CommonDesc';
import Label from '../../../components/bootstrap/forms/Label';
import Checks, { ChecksGroup } from '../../../components/bootstrap/forms/Checks';


import axios from "axios";
import { Cookies } from "react-cookie";
import jwt_decode from "jwt-decode";
axios.defaults.withCredentials = true;



const Profile = () => {
  const { themeStatus } = useDarkMode();


  //=======================================================================
  // My code

  const [studentSelf, setstudentSelf] = useState([]);

  useEffect(() => {

    const getstudentSelf = async () => {
      const cookies = new Cookies();
      const token = cookies.get("jwt");

      var decoded = jwt_decode(token);

      const response = await axios.post(
        "http://localhost:3500/student/getStudent",
        { RegNo: decoded.RegNo },
        {
          withCredentials: true, //correct
        }
      );

      setstudentSelf(response.data);
      console.log("STUDENT himself: ", response.data);

    };
    getstudentSelf();


  }, []);

  




  //=======================================================================

  //Update Profile


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
    console.log("ADD STUDENT!!!!", val);

    const Name = val.name;
    const Password = val.newPassword;
    const Email = val.emailAddress;
    const PhoneNumber = val.phone;
    const ProfilePicture = getFileBase64String;

  console.log(Name)
    await axios.put(
      "http://localhost:3500/student/student",
      {
        RegNo: `${studentSelf.RegNo}`,
        Name,
        Password,
        Email,
        PhoneNumber,
        ProfilePicture,
      },
      {
        withCredentials: true,
      }
    );



  };

  //=======================================================================



  const formik = useFormik({
    initialValues: {
      name: `${studentSelf.Name}`,
      regNo: `${studentSelf.RegNo}`,
      emailAddress: `${studentSelf.Email}`,
      phone: `${studentSelf.PhoneNumber}`,
      newPassword: '',
      confirmPassword: '',
      checkOne: true,
      checkTwo: false,
      checkThree: true,
    },
    validateOnChange: true,
    enableReinitialize: true,
    onSubmit: (values) => {
      console.log("VALUES: ", values);
      addToDatabase(values);

  
      showNotification(
        <span className="d-flex align-items-center">
          <Icon icon="Info" size="lg" className="me-1" />
          <span>Student Added Successfully</span>
        </span>,
        "Student has been added successfully"
      );
    },
  });

  const [passwordChangeCTA, setPasswordChangeCTA] = useState(false);
  /**
   * Common
   */
  const [lastSave, setLastSave] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const handleSave = () => {
    setLastSave(moment());
    setIsLoading(false);
    showNotification(
      <span className='d-flex align-items-center'>
        <Icon icon='Info' size='lg' className='me-1' />
        <span>Updated Successfully</span>
      </span>,
      "The user's account details have been successfully updated.",
    );
  };

  return (
    <PageWrapper title={"Profile"}>
      <SubHeader>
        <SubHeaderLeft>
          <Breadcrumb
            list={[
              { title: 'Users', to: '/' },
              { title: 'Edit User', to: '/' },
            ]}
          />
          <SubheaderSeparator />
          <span className='text-muted'>{studentSelf.Name}</span>
        </SubHeaderLeft>
        <SubHeaderRight>
          <Button
            icon={isLoading ? null : 'Save'}
            isLight
            color={lastSave ? 'info' : 'success'}
            isDisable={isLoading}
            onClick={formik.handleSubmit}>
            {isLoading && <Spinner isSmall inButton />}
            {isLoading
              ? (lastSave && 'Saving') || 'Saving'
              : (lastSave && 'Save') || 'Save'}
          </Button>
        </SubHeaderRight>
      </SubHeader>
      <Page>
        <div className='row h-100 align-content-start'>
          <div className='col-md-2'>
          </div>
          <div className='col-md-8'>
            <Card>
              <CardBody>
                <div className='col-12'>
                  <div className='row g-4 align-items-center'>
                    <div className='col-lg-auto'>
                      <Avatar
                        srcSet={studentSelf.ProfilePicture}
                        src={studentSelf.ProfilePicture}
                        color={USERS.JOHN.color}
                        rounded={3}
                      />
                    </div>
                    <div className='col-lg'>
                      <div className='row g-4'>
                        <div className='col-auto'>

                          <Input
                            type="file"
                            onChange={(e) => {
                              encodeFileBase64(e.target.files[0]);
                            }}
                          />
                        </div>

                        <div className='col-12'>
                          <p className='lead text-muted text-sm'>
                            Upload JPEG or PNG Image
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardBody>
            </Card>
            <Card>
              <CardHeader>
                <CardLabel icon='Person' iconColor='success'>
                  <CardTitle>Personal Information</CardTitle>
                  <CardSubTitle>User's credentials</CardSubTitle>
                </CardLabel>
              </CardHeader>
              <CardBody>
                <div className='row g-4'>
                  <div className='col-md-6'>
                    <FormGroup id='name' label='Name' isFloating>
                      <Input
                        onChange={formik.handleChange}
                        placeholder='Full Name'
                        autoComplete='additional-name'
                        onBlur={formik.handleBlur}
                        isValid={formik.isValid}


                        value={formik.values.name}
                        isTouched={formik.touched.name}
                        invalidFeedback={formik.errors.name}
                        validFeedback='Looks good!'
                        defaultValue={studentSelf.name}





                      />
                    </FormGroup>
                  </div>

                  <div className='col-md-6'>
                    <FormGroup
                      id='regNo'
                      label='Registration Number'
                      isFloating
                    >
                      <Input
                        disabled
                        placeholder='Registration Number'
                        autoComplete='username'
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.regNo}
                        isValid={formik.isValid}
                        isTouched={formik.touched.regNo}
                        invalidFeedback={formik.errors.regNo}
                        defaultValue={studentSelf.RegNo}

                        validFeedback='Looks good!'
                      />
                    </FormGroup>
                  </div>
                </div>
              </CardBody>
            </Card>
            <Card>
              <CardHeader>
                <CardLabel icon='Phonelink' iconColor='danger'>
                  <CardTitle>Contact Information</CardTitle>
                  <CardSubTitle>User's contact information</CardSubTitle>
                </CardLabel>
              </CardHeader>
              <CardBody>
                <div className='row g-4'>
                  <div className='col-md-6'>
                    <FormGroup
                      id='emailAddress'
                      label='Email address'
                      isFloating>
                      <Input
                        type='email'
                        placeholder='Email address'
                        autoComplete='email'
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.emailAddress}
                        isValid={formik.isValid}
                        isTouched={formik.touched.emailAddress}
                        invalidFeedback={formik.errors.emailAddress}
                        validFeedback='Looks good!'
                      />
                    </FormGroup>
                  </div>
                  <div className='col-md-6'>
                    <FormGroup id='phone' label='Phone Number' isFloating>
                      <Input
                        type='tel'
                        placeholder='Phone Number'
                        autoComplete='tel'
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.phone}
                        isValid={formik.isValid}
                        isTouched={formik.touched.phone}
                        invalidFeedback={formik.errors.phone}
                        validFeedback='Looks good!'
                      />
                    </FormGroup>
                  </div>
                </div>
              </CardBody>
            </Card>
            <Card>
              <CardHeader>
                <CardLabel icon='LocalPolice' iconColor='primary'>
                  <CardTitle>Password</CardTitle>
                  <CardSubTitle>Password change operations</CardSubTitle>
                </CardLabel>
                <CardActions>
                  {passwordChangeCTA ? (
                    <Button
                      color='danger'
                      isLight
                      icon='Cancel'
                      onClick={() => setPasswordChangeCTA(false)}>
                      Cancel
                    </Button>
                  ) : (
                    <>
                      <span>Do you want to change?</span>
                      <Button
                        color='primary'
                        isLight
                        icon='PublishedWithChanges'
                        onClick={() => setPasswordChangeCTA(true)}>
                        Yes
                      </Button>
                    </>
                  )}
                </CardActions>
              </CardHeader>
              {passwordChangeCTA && (
                <CardBody>
                  <div className='row g-4'>

                    <div className='col-12'>
                      <FormGroup
                        id='newPassword'
                        label='New password'
                        isFloating>
                        <Input
                          type='password'
                          placeholder='New password'
                          autoComplete='new-password'
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          value={formik.values.newPassword}
                          isValid={formik.isValid}
                          isTouched={formik.touched.newPassword}
                          invalidFeedback={formik.errors.newPassword}
                          validFeedback='Looks good!'
                        />
                      </FormGroup>
                    </div>
                    <div className='col-12'>
                      <FormGroup
                        id='confirmPassword'
                        label='Confirm new password'
                        isFloating>
                        <Input
                          type='password'
                          placeholder='Confirm new password'
                          autoComplete='new-password'
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          value={formik.values.confirmPassword}
                          isValid={formik.isValid}
                          isTouched={formik.touched.confirmPassword}
                          invalidFeedback={formik.errors.confirmPassword}
                          validFeedback='Looks good!'
                        />
                      </FormGroup>
                    </div>
                  </div>{' '}
                </CardBody>
              )}

            </Card>
          </div>

        </div>
        <div className='row'>
          <div className='col-2'>
          </div>

          <div className='col-8'>
            <Card>
              <CardBody>
                <div className='row align-items-center'>
                  <div className='col'>
                    {lastSave ? (
                      <>
                        <Icon
                          icon='DoneAll'
                          size='lg'
                          className='me-2 text-muted'
                        />
                        <span className='me-2 text-muted'>Last Saved</span>
                        <strong>
                          {moment(lastSave).format(
                            'MMMM Do, YYYY - HH:mm',
                          )}
                        </strong>
                      </>
                    ) : (
                      <>
                        <Icon
                          icon='Warning'
                          size='lg'
                          className='me-2 text-warning'
                        />
                        <span className='text-warning'>Not saved yet</span>
                      </>
                    )}
                  </div>
                  <div className='col-auto'>
                    <div className='row g-1'>
                      <div className='col-auto'>
                        <Button
                          icon={'Save'}
                          isLight
                          color={'success'}
                          onClick={formik.handleSubmit}>
                            Save
                   
                        </Button>
                      </div>
                      <div className='col-auto'>
                        <Dropdown direction='up'>
                          <DropdownToggle hasIcon={false}>
                            <Button
                              color={themeStatus}
                              icon='MoreVert'
                            />
                          </DropdownToggle>
                          <DropdownMenu isAlignmentEnd>
                            <DropdownItem>
                              <Button
                                className='me-3'
                                icon='Save'
                                isLight
                                isDisable={isLoading}
                                onClick={formik.resetForm}>
                                Reset
                              </Button>
                            </DropdownItem>
                          </DropdownMenu>
                        </Dropdown>
                      </div>
                    </div>
                  </div>
                </div>
              </CardBody>
            </Card>
          </div>
        </div>
      </Page>
    </PageWrapper>
  );
};

export default Profile;
