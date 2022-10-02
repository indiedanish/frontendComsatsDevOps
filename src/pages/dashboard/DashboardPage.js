import React, { useCallback, useEffect, useState } from "react";
import moment from "moment";

import { Link, useNavigate } from "react-router-dom";
import classNames from "classnames";
import { useTour } from "@reactour/tour";
import PageWrapper from "../../layout/PageWrapper/PageWrapper";
import SubHeader, {
  SubHeaderLeft,
  SubHeaderRight,
  SubheaderSeparator,
} from "../../layout/SubHeader/SubHeader";
import Page from "../../layout/Page/Page";
import Button, { ButtonGroup } from "../../components/bootstrap/Button";
import Card, {
  CardActions,
  CardBody,
  CardHeader,
  CardLabel,
  CardSubTitle,
  CardTitle,
} from "../../components/bootstrap/Card";
import Chart from "../../components/extras/Chart";

import Dropdown, {
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
} from "../../components/bootstrap/Dropdown";
import Alert, { AlertHeading } from "../../components/bootstrap/Alert";
import Icon from "../../components/icon/Icon";
import Badge from "../../components/bootstrap/Badge";

import Popovers from "../../components/bootstrap/Popovers";
import CommonAvatarTeam from "../../components/common/CommonAvatarTeam";
import CommonMyWallet from "../common/CommonMyWallet";

import Company1 from "../../assets/logos/company1.png";
import Company2 from "../../assets/logos/company2.png";
import Company3 from "../../assets/logos/company3.png";
import Company4 from "../../assets/logos/company4.png";

import UserContact from "../../components/UserContact";
import Avatar, { AvatarGroup } from "../../components/Avatar";
import USERS from "../../common/data/userDummyData";
import { demoPages } from "../../menu";
import data from "../../common/data/dummyProductData";
import { average, priceFormat } from "../../helpers/helpers";
import PercentComparison from "../../components/extras/PercentComparison";
import PaginationButtons, {
  dataPagination,
  PER_COUNT,
} from "../../components/PaginationButtons";
import useSortableData from "../../hooks/useSortableData";
import useDarkMode from "../../hooks/useDarkMode";
import Timeline, { TimelineItem } from "../../components/extras/Timeline";
import CommonTodo from "../common/CommonTodo";
import axios from "axios";
import { getColorNameWithIndex } from "../../common/data/enumColors";
import { Cookies } from "react-cookie";
import jwt_decode from "jwt-decode";
import SvgLayoutSidebarInset from "../../components/icon/bootstrap/LayoutSidebarInset";
import AreaChart from "../documentation/charts/chart-area/AreaIrregular.js";
axios.defaults.withCredentials = true;
import useAuth from "../../hooks/useAuth";

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

  const getTasks = async (projectname, regno) => {
    console.log("projectname", projectname);
    const response = await axios.post(
      "http://localhost:3500/student/getStudentRequirement",
      { ProjectName: projectname, RegNo: regno },
      {
        withCredentials: true, //correct
      }
    );
    console.log("TASKS: ", response.data);
    setTasks(response.data);
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

    getTasks(response.data.Project.Name, decoded.RegNo);
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
  }
  
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
            <strong>Team</strong> Members
          </CommonAvatarTeam>
        </SubHeaderRight>
      </SubHeader>
      <Page container="fluid">
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
              name={`${studentSelf.Name} - ${studentSelf.RegNo}`}
              position={studentSelf.Role}
              mail={studentSelf.Email}
              phone="234234234"
              onChat={() =>
                navigate(`../${demoPages.chat.subMenu.withListChat.path}`)
              }
              src={USERS.SAM.src}
              srcSet={USERS.SAM.srcSet}
              color={USERS.SAM.color}
            />
          </div>

          {[1, 2, 3].map((i, key) => (
            <div
              className="col-xl-4"
              style={{
                display: "inline-block",
                zoom: 1,
                float: "none",
                marginRight: 10,
              }}
            >
              <Card stretch>
                <CardHeader className="bg-transparent">
                  <CardLabel>
                    <CardTitle tag="h4" className="h5">
                      {i.Name}
                    </CardTitle>
                    <CardSubTitle tag="h5" className="h6 text-muted">
                      {i.Role}
                    </CardSubTitle>
                  </CardLabel>
                  <CardActions>
                    <Button
                      icon="ArrowForwardIos"
                      aria-label="Read More"
                      hoverShadow="default"
                      color={darkModeStatus ? "dark" : null}
                      onClick={() => {}}
                    />
                    <Button
                      icon="Delete"
                      aria-label="Read More"
                      hoverShadow="default"
                      color={darkModeStatus ? "dark" : null}
                      onClick={() => {
                        deleteTeam(i._id);
                      }}
                    />
                  </CardActions>
                </CardHeader>
                <CardBody>
                  <h7>
                    {i.Student == undefined
                      ? "Currently, no member is added"
                      : i.Student.length == 1
                      ? `${i.Student.length} Member`
                      : `${i.Student.length} Members`}
                  </h7>
                </CardBody>
              </Card>
            </div>
          ))}
        </div>
        <div className="row">
          <div className="col-xxl-4">
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
                      label={new Date(i.Deadline).toLocaleString(
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
          <div className="col-xxl-4">
            <CommonTodo />
          </div>

          <AreaChart />
        </div>
      </Page>
    </PageWrapper>
  );
};

export default DashboardPage;
