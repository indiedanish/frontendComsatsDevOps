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
import ProjectAddModal from "./ProjectAddModal";




axios.defaults.withCredentials = true;
import axios from "axios";
import {Grid} from 'react-loader-spinner'

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




const AllProjectsList = () => {
  const navigate = useNavigate();

  const [addModalStatus, setAddModalStatus] = useState(false);

  const reload = () => {
    getProjects()  
  }

  useEffect(() => {
    getProjects();
  }, [addModalStatus]);


  const { auth, setAuth } = useAuth();
  const [ProjectData, setProjectData] = useState(null);

  console.log(auth);

  const getProjects = async () => {
    const response = await axios.get(
      "http://localhost:3500/teacher/allProject",
      {
        withCredentials: true, //correct
      }
    );
    console.log("ffff ", response.data);

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


           <div className='col-md-4'>
            <Card stretch>
              <CardBody className='d-flex align-items-center justify-content-center'>
                <Button
                  color='info'
                  size='lg'
                  isLight
                  className='w-100 h-100'
                  onClick={() => setAddModalStatus(true)}
                  icon='AddCircle'>
                  Add New
                </Button>

              
              </CardBody>
            </Card>
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
                name={project.Name}
                teamName="Supervisor"
                dueDate={project.Status}
                groupMembers={project.GroupMembers}
                taskCount={project.Description}
                percent={
                  project.Status == ""
                  ? 0
                  : project.Status == "Scope"
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

      <ProjectAddModal
        setIsOpen={setAddModalStatus}
        isOpen={addModalStatus}
        id={0}
        reload={reload}
      />

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
