import React, { useCallback, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import PropTypes from "prop-types";
import classNames from "classnames";
import PageWrapper from "../../../layout/PageWrapper/PageWrapper";
import Page from "../../../layout/Page/Page";
import Card, { CardBody } from "../../../components/bootstrap/Card";
import FormGroup from "../../../components/bootstrap/forms/FormGroup";
import Input from "../../../components/bootstrap/forms/Input";
import Button from "../../../components/bootstrap/Button";
import axios from "axios";
import SweetAlert from "react-bootstrap-sweetalert";
import useDarkMode from "../../../hooks/useDarkMode";
import useAuth from "../../../hooks/useAuth";
import { replace } from "formik";
import { Cookies } from "react-cookie";
import jwt_decode from "jwt-decode";


const Login = (props) => {
  const { darkModeStatus } = useDarkMode();

  const [usernameInput, setUsernameInput] = useState(false);

  const [Email, setEmail] = useState("");
  const [Password, setPassword] = useState("");

  const [errorModal, setErrorModal] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  //const handleAdminLogin = useCallback(() => navigate('/'), [navigate]);

  const [user, setuser] = useState("Student");

  const { auth, setAuth } = useAuth();

  console.log("THIS IA AUTH IN LOGIN PAGE", auth);

  const cookies = new Cookies();
  const token = cookies.get("jwt");

  const handleAdminLogin = async (e) => {

    e.preventDefault();

    try {
      const response = await axios.post(
        "http://localhost:3500/auth/admin",
        {
          Email,
          Password,
        },
        {
          withCredentials: true, //correct
        }
      );

      console.log("find it ", response.data);

      var decoded = jwt_decode(response.data.refreshToken);

      console.log("decoded", decoded);
      setAuth(decoded);
      console.log("SVED AUTH", auth);

      //  navigate("/sales/sales-list", { replace: true });
    } catch (e) {
      console.log("oh no" + e);
      setErrorModal(true);
    }

    // setEmail("");
    // setPassword("");
  };

  const handleTeacherLogin = async (e) => {

    e.preventDefault();

    try {


      const response = await axios.post(
        "http://localhost:3500/auth/teacher",
        {
          Email,
          Password,
        },
        {
          withCredentials: true, //correct
        }
      );

      console.log("find it ", response.data);



      var decoded = jwt_decode(response.data.refreshToken);

      console.log("decodedNEW", decoded.Email, decoded.Role);

      const userInfo = await axios.post(
        "http://localhost:3500/teacher/getTeacher",
        { Email: decoded.Email },
        {
          withCredentials: true, //correct
        }
      );

      setAuth(userInfo.data);
      window.location.reload()

    } catch (e) {
      console.log("oh no" + e);
      setErrorModal(true);
    }

    // setEmail("");
    // setPassword("");
  };

  const handleStudentLogin = async (e) => {

    e.preventDefault();

    try {

      const RegNo = Email;
      const response = await axios.post(
        "http://localhost:3500/auth/student",
        {
          RegNo,
          Password,
        },
        {
          withCredentials: true, //correct
        }
      );

      console.log("find it ", response.data);



      var decoded = jwt_decode(response.data.refreshToken);

      console.log("decodedNEW", decoded.RegNo);

      const userInfo = await axios.post(
        "http://localhost:3500/student/getStudent",
        { RegNo: decoded.RegNo },
        {
          withCredentials: true, //correct
        }
      );
      console.log("GIVEEE", userInfo)
      setAuth(userInfo.data);

      // navigate("/sales/sales-list", { replace: true });
    } catch (e) {
      console.log("oh no" + e);
      setErrorModal(true);
    }

    // setEmail("");
    // setPassword("");
  };

  function isEmail(val) {
    return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(val);
  }

  return (
    <PageWrapper title="Login" className={classNames("bg-warning")}>
      {errorModal ? (
        <SweetAlert
          error
          confirmBtnBsStyle="warning"
          title="Invalid Credentials"
          onConfirm={() => setErrorModal(false)}
        >
          Please enter valid details
        </SweetAlert>
      ) : (
        ""
      )}
      <Page className="p-0 mt-3 mb-5 pb-5">
        <div className="row h-100 align-items-center justify-content-center">
          <div className="col-xl-4 col-lg-6 col-md-8 shadow-3d-container">
            <Card className="shadow-3d-dark" data-tour="login-page">
              <CardBody>

                <div
                  className='bg-slate-50 rounded-1'>
                  <div className='row row-cols-3 g-3 pb-3 px-3 mt-0'>
                    <div className='col'>
                      <Button
                        color={user == "Student" ? 'warning' : 'dark'}
                        //isLight={!!isNewUser}
                        className='rounded-1 w-100  '
                        size='lg'
                        onClick={() => {
                          setuser("Student");
                        }}>

                        Student

                      </Button>
                    </div>
                    <div className='col'>
                      <Button
                        color={user == "Teacher" ? 'warning' : 'dark'}
                        //	isLight={!isNewUser}
                        className='rounded-1 w-100'
                        size='lg'
                        onClick={() => {
                          setuser("Teacher");

                        }}>
                        Teacher
                      </Button>
                    </div>
                    <div className='col'>
                      <Button
                        color={user == "Admin" ? 'warning' : 'dark'}
                        //	isLight={!isNewUser}
                        className='rounded-1 w-100'
                        size='lg'
                        onClick={() => {
                          setuser("Admin")

                        }}>
                        Admin
                      </Button>
                    </div>
                  </div>
                </div>
                <div className="text-center my-5">
                  <Link
                    to="/"
                    className={classNames(
                      "text-decoration-none  fw-bold display-2",
                      {
                        "text-dark": !darkModeStatus,
                        "text-light": darkModeStatus,
                      }
                    )}
                  >
                    <img
                      style={{ width: 150, height: "auto" }}
                      src="https://seeklogo.com/images/C/comsats-university-islamabad-logo-B7C2E461B5-seeklogo.com.png"
                      alt="new"
                    />
                  </Link>
                </div>
                <div
                  className={classNames("rounded-3", {
                    "bg-l10-dark": !darkModeStatus,
                    "bg-lo10-dark": darkModeStatus,
                  })}
                ></div>

                <div className="text-center h1 fw-bold mt-5">Welcome to</div>
                <div className="text-center h1 fw-bold">Comsats DevOps</div>
                <div className="text-center h4 text-muted mb-5">Sign in as to continue!</div>

                <form className="row g-4">
                  <>
                    <div className="col-12">
                      <FormGroup
                        id="login-username"
                        isFloating
                        label="Your email or registration no"
                      >
                        <Input
                          type="email"
                          autoComplete="email"
                          value={Email}
                          onChange={(e) => setEmail(e.target.value)}
                        />
                      </FormGroup>
                      <FormGroup
                        id="login-password"
                        isFloating
                        label="Password"
                      >
                        <Input
                          style={{ marginTop: "10px" }}
                          type="password"
                          autoComplete="password"
                          value={Password}
                          onChange={(e) => setPassword(e.target.value)}
                        />
                      </FormGroup>
                    </div>
                    <div className="col-12">
                      <Button
                        color="warning"
                        className="w-100 py-3"
                        onClick={
             
                            user == "Student" ? handleStudentLogin : user == "Teacher" ? handleTeacherLogin : handleAdminLogin
                       

                         
                          
                        
                        }
                      >

                        Login
                      </Button>
                    </div>
                    {/* {user ? (
                      <div className="border-2 border-black w-full justify-center items-center text-center">
                        <Button  onClick={() => setuser(!user)} className="">Login as admin</Button>
                      </div>
                    ) : (
                      <div className="border-2 border-black w-full justify-center items-center text-center">
                        <Button
                          onClick={() => setuser(!user)}
                          className=""
                        >
                          Login as student
                        </Button>
                      </div>
                    )} */}
                  </>

                  {/* BEGIN :: Social Login */}
                  {!usernameInput && <></>}
                  {/* END :: Social Login */}
                </form>
              </CardBody>
            </Card>
            <div className="text-center">
              <a
                href="/"
                className={classNames(
                  "text-decoration-none me-3",
                  "link-light"
                )}
              >
                Privacy policy
              </a>
              <a
                href="/"
                className={classNames(
                  "link-light text-decoration-none",
                  "link-light"
                )}
              >
                Terms of use
              </a>
            </div>
          </div>
        </div>
      </Page>
    </PageWrapper>
  );
};

// Login.propTypes = {

// 	function1: PropTypes.func.isRequired
//   };

export default Login;
