import React, { useCallback, useEffect, useState } from "react";
import moment from "moment";

import { Link, useNavigate } from "react-router-dom";
import classNames from "classnames";
import { useTour } from "@reactour/tour";
import PageWrapper from "../../../layout/PageWrapper/PageWrapper";
import SubHeader, {
  SubHeaderLeft,
  SubHeaderRight,
  SubheaderSeparator,
} from "../../../layout/SubHeader/SubHeader";
import Page from "../../../layout/Page/Page";
import Button, { ButtonGroup } from "../../../components/bootstrap/Button";
import Card, {
  CardActions,
  CardBody,
  CardHeader,
  CardLabel,
  CardSubTitle,
  CardTitle,
} from "../../../components/bootstrap/Card";
import Chart from "../../../components/extras/Chart";

import Dropdown, {
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
} from "../../../components/bootstrap/Dropdown";
import Alert, { AlertHeading } from "../../../components/bootstrap/Alert";
import Icon from "../../../components/icon/Icon";

import CommonAvatarTeam from "../../../components/common/CommonAvatarTeam";



import UserContact from "../../../components/UserContact";
import USERS from "../../../common/data/userDummyData";
import { demoPages } from "../../../menu";
import { average, priceFormat } from "../../../helpers/helpers";
import PercentComparison from "../../../components/extras/PercentComparison";
import PaginationButtons, {
  dataPagination,
  PER_COUNT,
} from "../../../components/PaginationButtons";
import useSortableData from "../../../hooks/useSortableData";
import useDarkMode from "../../../hooks/useDarkMode";
import Timeline, { TimelineItem } from "../../../components/extras/Timeline";
import CommonTodo from "../../../pages/common/CommonTodo";
import axios from "axios";
import { getColorNameWithIndex } from "../../../common/data/enumColors";
import { Cookies } from "react-cookie";
import jwt_decode from "jwt-decode";
axios.defaults.withCredentials = true;
import useAuth from "../../../hooks/useAuth";
import { Grid } from "react-loader-spinner";
import RadialBarMultiple from '../../../pages/documentation/charts/chart-radial-bar/RadialBarMultiple';
import RadialBarCustom from '../../../pages/documentation/charts/chart-radial-bar/RadialBarCustom';
import RadialBarGradient from '../../../pages/documentation/charts/chart-radial-bar/RadialBarGradient';

const DashboardPage = () => {
  useEffect(() => {
    getstudentSelf();
  }, []);
  const { auth, setAuth } = useAuth();

  console.log("AUTHHHHDAN", auth);

  const { themeStatus, darkModeStatus } = useDarkMode();

  const navigate = useNavigate();

  const [tasks, setTasks] = useState([]);

  const [studentSelf, setstudentSelf] = useState([]);

  const [projectInfo, setProjectInfo] = useState(null);
  const [groupMembers, setGroupMembers] = useState([]);

  // const getTasks = async (projectname, regno) => {
  //   console.log("projectname", projectname);
  //   const response = await axios.post(
  //     "http://localhost:3500/student/getStudentRequirement",
  //     { ProjectName: projectname, RegNo: regno },
  //     {
  //       withCredentials: true, //correct
  //     }
  //   );
  //   console.log("TASKS: ", response.data);
  //   setTasks(response.data);
  // };

  const getProject = async (projectname) => {
    console.log("projectname", projectname);
    const response = await axios.post(
      "http://localhost:3500/student/project",
      { Name: projectname },
      {
        withCredentials: true,
      }
    );
    console.log("Project Info: ", response.data);
    setProjectInfo(response.data);
    setGroupMembers(response.data.GroupMembers);
    console.log("Requirements!!!: ", response.data.Requirements);
    setTasks(response.data.Requirements);
  };

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

    getProject(response.data.Project.Name);
  };

  const deleteTeam = async (id) => {
    await axios.delete(`http://localhost:3500/team/${id}`, { id });
    getTeams();
  };

  const PRIORITY_BADGES = [
    { text: "High", color: "danger" },
    { text: "Low", color: "success" },
    { text: "Medium", color: "info" },
  ];
  const getTaskColor = (priority) => {
    return PRIORITY_BADGES.find((badge) => badge.text == priority).color;
  };

  return (
    <PageWrapper title={demoPages.sales.subMenu.dashboard.text}>
      <SubHeader>
        <SubHeaderLeft>
          <span className="h4 mb-0 fw-bold">Dashboard </span>
          <SubheaderSeparator />
          <span className="h4 mb-0 fw-bold">Welcome! Lets work togather</span>
        </SubHeaderLeft>
        <SubHeaderRight>
          <CommonAvatarTeam>
            <strong>Team</strong> {studentSelf.Role == null ? "" : studentSelf.Role.substring(4)}
          </CommonAvatarTeam>
        </SubHeaderRight>
      </SubHeader>
  { projectInfo==null?
  
  <div className="w- flex  h-[700px] justify-center items-center">
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
  
  
  
  :   <Page container="fluid ">
        <div
          style={{
            overflowX: "scroll",
            overflowY: "hidden",
            whiteSpace: "nowrap",
            WebkitOverflowScrolling: "touch",
            position: "relative",
          }}
        >
          {/* <div className='col-12'>
						<Alert
							icon='Verified'
							isLight
							color='primary'
							borderWidth={0}
							className='shadow-3d-primary'
							isDismissible>
							<AlertHeading tag='h2' className='h4'>
								Congratulations! 🎉
							</AlertHeading>
							<span>You have reached your monthly sales targets.</span>
						</Alert>
					</div> */}
          {groupMembers.map((i, key) => (
            <div
              className="col-xl-4"
              style={{
                display: "inline-block",
                zoom: 1,
                float: "none",
                marginRight: 10,
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
          ))}

     
        </div>
        <div className="row bg-red-500">
          <div className="col-4">
            <Card stretch>
              <CardHeader>
                <CardLabel icon="NotificationsActive" iconColor="warning">
                  <CardTitle tag="h4" className="h5">
                    Recent Tasks
                  </CardTitle>
                  <CardSubTitle>last 2 weeks</CardSubTitle>
                </CardLabel>
              </CardHeader>
              <CardBody>
                <Timeline>
                  {tasks.map((i, key) => (
                    <TimelineItem
                      label={new Date(i.end).toLocaleString(
                        "en-US",

                        { year: "numeric", month: "numeric", day: "numeric" }
                        // {
                        //  day: '2-digit',
                        // 	 month: '2-digit',
                        // 	// year: 'numeric',
                        // 	// hour: '2-digit',
                        // 	// minute: '2-digit',
                        // 	// // second: '2-digit',
                        // 	// hour12: true,
                        // }
                      )}
                      color={getTaskColor(i.Priority)}
                    >
                      {i.Title} - {i.Priority} - {i.AssignedTo.Name}
                    </TimelineItem>
                  ))}
                </Timeline>
              </CardBody>
            </Card>
          </div>
          <div className="col-4">
            <CommonTodo />
          </div>
          <div className="col-4">
          <RadialBarMultiple />

          </div>




        </div>
{/* 
        <RadialBarCustom />
<RadialBarGradient /> */}
      </Page>}
    </PageWrapper>
  );
};

export default DashboardPage;
