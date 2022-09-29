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
// eslint-disable-next-line react/prop-types
const LoginHeader = ({ isNewUser }) => {
  // if (isNewUser) {
  // 	return (
  // 		<>
  // 			<div className='text-center h1 fw-bold mt-5'>Create Account,</div>
  // 			<div className='text-center h4 text-muted mb-5'>Sign up to get started!</div>
  // 		</>
  // 	);
  // }
  return (
    <>
      <div className="text-center h1 fw-bold mt-5">Welcome to</div>
      <div className="text-center h1 fw-bold">Comsats DevOps</div>
      <div className="text-center h4 text-muted mb-5">Sign in to continue!</div>
    </>
  );
};

const Login = (props) => {
  const { darkModeStatus } = useDarkMode();

  const [usernameInput, setUsernameInput] = useState(false);

  const [Email, setEmail] = useState("");
  const [Password, setPassword] = useState("");

  const [errorModal, setErrorModal] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  //const handleOnClick = useCallback(() => navigate('/'), [navigate]);


  const { auth, setAuth } = useAuth();

  console.log("THIS IA AUTH IN LOGIN PAGE", auth)
        
	const cookies = new Cookies();
	const token = cookies.get("jwt");

  const handleOnClick = async (e) => {
    console.log(Email, Password);
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
    console.log("SVED AUTH", auth)
  
       navigate("/sales/sales-list", { replace: true });

    } catch (e) {
      console.log("oh no" + e);
      setErrorModal(true);
    }

    setEmail("");
    setPassword("");
    const data = response.data[0];
    const userData = response.data[1];
    if (data == "Logged in") {
      // useCallback(() => navigate('/'), [navigate])

      try {
        // props.fun();
        localStorage.setItem("user", JSON.stringify(userData));

        navigate("/sales/sales-list", { replace: true });
      } catch (err) {
        console.log(err);
      }
    } else {
    }
  };

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

                <LoginHeader isNewUser="Dd" />

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
                        onClick={handleOnClick}
                      >
                        Login
                      </Button>
                    </div>
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
