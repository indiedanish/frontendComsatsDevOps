import React, { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PageWrapper from "../../../layout/PageWrapper/PageWrapper";
import { demoPages } from "../../../menu";
import SubHeader, {
  SubHeaderLeft,
  SubHeaderRight,
  SubheaderSeparator,
} from "../../../layout/SubHeader/SubHeader";
import Page from "../../../layout/Page/Page";
import Badge from "../../../components/bootstrap/Badge";
import Card, {
  CardActions,
  CardBody,
  CardHeader,
  CardLabel,
  CardSubTitle,
  CardTitle,
} from "../../../components/bootstrap/Card";
import Button from "../../../components/bootstrap/Button";
import Avatar, { AvatarGroup } from "../../../components/Avatar";
import USERS from "../../../common/data/userDummyData";
import Icon from "../../../components/icon/Icon";
import Progress from "../../../components/bootstrap/Progress";
import CommonAvatarTeam from "../../../components/common/CommonAvatarTeam";
import useDarkMode from "../../../hooks/useDarkMode";
import useAuth from "../../../hooks/useAuth";
import Swal from "sweetalert2";
axios.defaults.withCredentials = true;
import axios from "axios";
import {Grid} from 'react-loader-spinner'
import { Badge3D } from "../../../components/icon/bootstrap";

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
       
        className="cursor-pointer"
      >
        <CardHeader>
          <CardLabel icon="Ballot">
            <CardTitle>{name}</CardTitle>
            <CardSubTitle>{teamName}</CardSubTitle>
          </CardLabel>
          <CardActions>
           
            <Button
            

            onClick={()=>{

              Swal.fire(
                'Email Sent!',
                'Invitation link has been sent',
                'success'
              )
            }}
            color="warning"
          
          ><small>Send Request  </small>         <Icon icon="send" />

            </Button>
          </CardActions>

          
        </CardHeader>
        <CardBody>
          <div className="row g-2 mb-3">
            <div className="col-auto">
              <small className={"text-align: justify "} color={darkModeStatus ? "light" : "dark"} isLight >
               <div className={"text-align: justify  font-bold"}> Description:
                </div>  {taskCount}
              </small>
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

const AllProjectsList = () => {
  const navigate = useNavigate();

  const { auth, setAuth } = useAuth();
  const [ProjectData, setProjectData] = useState(null);


  const getProjects = async () => {
    const response = await axios.get(
      "http://localhost:3500/student/allProject",
      {
        withCredentials: true, //correct
      }
    );
    console.log("All Projects ", response.data);

    const temp = response.data;
    setProjectData(response.data);
  };

  useEffect(() => {
    console.log("ProjectData", ProjectData);

    getProjects();
  }, []);

  return (
    <PageWrapper title="All Project | DEV">
      <SubHeader>
        <SubHeaderLeft>
          <strong className="fs-5">FYP Projects</strong>
          <SubheaderSeparator />
          <span>
            There are{" "}
            <Badge color="success" isLight>


              {ProjectData == null
                ? ""
                : ProjectData.length}{" "}
              Projects
            </Badge>
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
          
          ProjectData == null
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
            : ProjectData.map((project, key) => (
              <Item
                key={project._id}
                name={project.Name}
                teamName={project.GroupSupervisor.Name}
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

export default AllProjectsList;

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
