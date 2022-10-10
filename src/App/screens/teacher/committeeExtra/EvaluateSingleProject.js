import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
axios.defaults.withCredentials = true;
import axios from "axios";
import useAuth from "../../../../hooks/useAuth";
import { Grid } from 'react-loader-spinner'
import USERS from "../../../../common/data/userDummyData";
import UserContact from "../../../../components/UserContact";



import PageWrapper from "../../../../layout/PageWrapper/PageWrapper";
import SubHeader, {
  SubHeaderLeft,
  SubHeaderRight,
  SubheaderSeparator,
} from "../../../../layout/SubHeader/SubHeader";
import Page from "../../../../layout/Page/Page";
import Badge from "../../../../components/bootstrap/Badge";
import Card, {
  CardActions,
  CardBody,
  CardHeader,
  CardLabel,
  CardSubTitle,
  CardTitle,
} from "../../../../components/bootstrap/Card";
import Button from "../../../../components/bootstrap/Button";
import Avatar, { AvatarGroup } from "../../../../components/Avatar";

import Icon from "../../../../components/icon/Icon";
import Progress from "../../../../components/bootstrap/Progress";
import CommonAvatarTeam from "../../../../components/common/CommonAvatarTeam";

import { useNavigate } from "react-router-dom";









const EvaluateSingleProject = () => {
  const navigate = useNavigate();

  const { projectname } = useParams();
  const { auth, setAuth } = useAuth();
  const [singleProject, setsingleProject] = useState(null);

  console.log(auth);

  const getProject = async () => {
    const response = await axios.post(
      "http://localhost:3500/teacher/getProject",
      { Name: projectname },
      {
        withCredentials: true, //correct
      }
    );
    setsingleProject(response);
    console.log("ProjectDetails: ", response.data);


  };

  useEffect(() => {
    console.log("setsingleProject", singleProject);

    getProject();
  }, []);

  return (
    <>










      <PageWrapper title="Evaluation | DEV">
        <SubHeader>
          <SubHeaderLeft>
            <strong className="fs-5">FYP Evaluation</strong>
            <Button
              icon="arrow-left"
              onClick={() => {
                navigate(-1);
              }}
            >

            </Button>
            <SubheaderSeparator />
            <span>
              There are{" "}
              <Badge color="success" isLight>


                {singleProject == null
                  ? ""
                  : singleProject.data.GroupMembers.length}{" "}
                Group Members
              </Badge>
              in your committee .
            </span>
          </SubHeaderLeft>
          <SubHeaderRight>
            <CommonAvatarTeam>
              <strong>Comsats DevOps</strong>
            </CommonAvatarTeam>
          </SubHeaderRight>
        </SubHeader>
        <Page>
          <div className="row mt-3">
            <div className="col-12">
              <div className="display-4 fw-bold py-3">Group Members</div>
            </div>

            {

              singleProject == null
                ?
                <div className="w- flex  h-[400px] justify-center items-center">
                  <Grid
                    height="150"
                    width="150"
                    color="#6C5DD3"
                    ariaLabel="grid-loading"
                    radius="12.5"
                    wrapperStyle={{}}
                    wrapperClass=""
                    visible={true}
                  />
                </div>

                : singleProject.data.GroupMembers.map((i, key) => (
                  <div
                    className="col-xl-4 cursor-pointer"
                    style={{
                      display: "inline-block",
                      zoom: 1,
                      float: "none",
                      marginRight: 10,
                    }}

                    onClick={() => {
                      navigate(`/committee/evaluation/evaluatestudent/${i.RegNo}/${projectname}/${i.FypStatus}`);
                    }}
                  >
                    <UserContact
                      name={`${i.Name} - ${i.RegNo}`}
                      position={i.Role}
                      mail={i.Email}
                      phone={i.length == 0 ? "" : i.PhoneNumber.toString()}
                      onChat={() =>
                        navigate(`../${demoPages.chat.subMenu.withListChat.path}`)
                      }
                      src={USERS.SAM.src}
                      srcSet={i.ProfilePicture}
                      color={USERS.SAM.color}
                    />
                  </div>
                ))



            }
          </div>
        </Page>
      </PageWrapper>
    </>

  );
}
export default EvaluateSingleProject;
