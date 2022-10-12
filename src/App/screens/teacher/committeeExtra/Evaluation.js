import React, { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PageWrapper from "../../../../layout/PageWrapper/PageWrapper";
import { demoPages } from "../../../../menu";
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
import USERS from "../../../../common/data/userDummyData";
import Icon from "../../../../components/icon/Icon";
import Progress from "../../../../components/bootstrap/Progress";
import CommonAvatarTeam from "../../../../components/common/CommonAvatarTeam";
import useDarkMode from "../../../../hooks/useDarkMode";
import useTourStep from "../../../../hooks/useTourStep";
import useAuth from "../../../../hooks/useAuth";
import { Cookies } from "react-cookie";
import jwt_decode from "jwt-decode";
import SvgLayoutSidebarInset from "../../../../components/icon/bootstrap/LayoutSidebarInset";
import AreaChart from "../../../../pages/documentation/charts/chart-area/AreaIrregular.js";
axios.defaults.withCredentials = true;
import axios from "axios";
import {Grid,Radio} from 'react-loader-spinner'

// eslint-disable-next-line react/prop-types
const Item = ({
  name,
  teamName,
  groupMembers,
  taskCount,
  percent,
  dueDate,
  ...props
}) => {
  const { darkModeStatus } = useDarkMode();
  const navigate = useNavigate();
  // const handleOnClickToProjectPage = useCallback(
  //   () => navigate("/committee/evaluation/project")[navigate]
  // );
  return (
    // eslint-disable-next-line react/jsx-props-no-spreading
    <div className="col-md-4" {...props}>
      <Card
        stretch
        onClick={()=>navigate(`/committee/evaluation/project/${name}`)[navigate]}
        className="cursor-pointer"
      >
        <CardHeader>
          <CardLabel icon="Ballot">
            <CardTitle>{name}</CardTitle>
            <CardSubTitle>{teamName}</CardSubTitle>
          </CardLabel>
          <CardActions>
            <small className="border border-success border-2 text-success fw-bold px-2 py-1 rounded-1">
              {dueDate}
            </small>
          </CardActions>
        </CardHeader>
        <CardBody>
          <div className="row g-2 mb-3">
            <div className="col-auto">
              <Badge color={darkModeStatus ? "light" : "dark"} isLight>
                <Icon icon="TaskAlt" /> {taskCount}
              </Badge>
            </div>
          </div>
          <div className="row">
            <div className="col-md-6">
              {percent}%
              <Progress isAutoColor value={percent} height={10} />
            </div>
            <div className="col-md-6 d-flex justify-content-end">
              <AvatarGroup>
                {groupMembers.map((member) => (
                  <Avatar
                    srcSet={member.ProfilePicture}
                    src={USERS.GRACE.src}
                    userName={member.Name}
                    color={USERS.GRACE.color}
                  />
                ))}
              </AvatarGroup>
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};

const Evaluation = () => {
  const navigate = useNavigate();

  const { auth, setAuth } = useAuth();
  const [teacherSelf, setteacherSelf] = useState(null);

  console.log(auth);

  const getteacherSelf = async () => {
    const response = await axios.post(
      "http://localhost:3500/teacher/getTeacher",
      { Email: auth.Email },
      {
        withCredentials: true, //correct
      }
    );
    console.log("ffff ", response.data);

    const temp = response.data;
    setteacherSelf(response);
  };

  useEffect(() => {
    console.log("teacherSelf", teacherSelf);

    getteacherSelf();
  }, []);

  return (
    <PageWrapper title="Evaluation | DEV">
      <SubHeader>
        <SubHeaderLeft>
          <strong className="fs-5">FYP Evaluation</strong>
          <SubheaderSeparator />
          <span>
            There are{" "}
            <Badge color="success" isLight>


              {teacherSelf == null
                ? ""
                : teacherSelf?.data?.Committee?.Projects?.length}{" "}
              projects
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
            <div className="display-4 fw-bold py-3">Projects</div>
          </div>

          {
          
          teacherSelf == null || !teacherSelf?.data?.Committee?.Projects
            ?
            <div className="w- flex flex-col  h-[700px] justify-center items-center">
            <Radio
              height="150"
              width="150"
              color="#6C5DD3"
              ariaLabel="grid-loading"
              radius="12.5"
              wrapperStyle={{}}
              wrapperClass=""
              visible={true}
            />
           <h4 className="mt-5">You might not have any projects</h4> 


          </div>
            : teacherSelf?.data?.Committee?.Projects.map((project, key) => (
              <Item
                name={project.Name}
                teamName="Supervisor"
                dueDate={project.Status}
                groupMembers={project.GroupMembers}
                taskCount={project.Description}
                percent={
                  project.Status == "Scope"
                    ? 25
                    : project.Status == "SDS"
                      ? 50
                      : project.Status == "Testing"
                        ? 75
                        : project.Status == "Final"
                          ? 100
                          : 0
                }
                data-tour="project-item"
              />
            ))}
        </div>
      </Page>
    </PageWrapper>
  );
};

export default Evaluation;

// ADD PROJECT VALA COMMENT KIYA YEH
{
  /* <div className='col-md-4'>
            <Card stretch>
              <CardBody className='d-flex align-items-center justify-content-center'>
                <Button
                  color='info'
                  size='lg'
                  isLight
                  className='w-100 h-100'
                  icon='AddCircle'>
                  Add New
                </Button>
              </CardBody>
            </Card>
          </div> */
}
