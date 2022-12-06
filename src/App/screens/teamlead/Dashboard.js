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
import { Grid, Radio } from "react-loader-spinner";
import RadialBarMultiple from '../../../pages/documentation/charts/chart-radial-bar/RadialBarMultiple';
import RadialBarCustom from '../../../pages/documentation/charts/chart-radial-bar/RadialBarCustom';
import RadialBarGradient from '../../../pages/documentation/charts/chart-radial-bar/RadialBarGradient';
import MixedMultipleYAxis from '../../../pages/documentation/charts/chart-mixed/MixedMultipleYAxis';
import Sprint from './Sprint'

const DashboardPage = () => {
  useEffect(() => {
    getstudentSelf();


  }, []);

  const reload = () => {
    getstudentSelf()
  }
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

  const [ReqChartData, setReqChartData] = useState([]);

  const [lineChartReqData, setlineChartReqData] = useState([]);

  const [acceptedReqChartData, setacceptedReqChartData] = useState([]);

  const [highPrioirityReqChartData, sethighPrioirityReqChartData] = useState([]);

  // { "danish": {devel: 3 , test: 3 , Design : 6} , "sajid": {devel: 3 , test: 3 , Design : 6} }
  // 

  const calculateReqChartData = (arr, req) => {

    console.log(arr);
    console.log("___");

    console.log(req);

    //setacceptedReqChartData
    //sethighPrioirityReqChartData

    var tempSetlineChartReqData = [];
    var acceptedCountArr = arr.slice();
    var highPrioirityCountArr = arr.slice();;



    const countHighPriority = req.map((r) => {



      if (r.Type == "Testing" && r.Priority == "High") {

        highPrioirityCountArr.map((s) => {

          if (s.Id == r.AssignedTo._id) {
            s.Test = s.Test + 1;
            console.log("GOTT ITT HEREEE", r.AssignedTo.Name);


          }
          return

        })







      }

      else if (r.Type == "Design" && r.Priority == "High") {

        highPrioirityCountArr.map((s) => {

          if (s.Id == r.AssignedTo._id) {
            s.Design = s.Design + 1;
          }

          return

        })


      }

      else if (r.Type == "Development" && r.Priority == "High") {

        highPrioirityCountArr.map((s) => {

          if (s.Id == r.AssignedTo._id) {
            s.Dev = s.Dev + 1;
          }

          return

        })


      }



      console.log("acceptedCountArr: ", acceptedCountArr);
      return

    })





    const countAccepted = req.map((r) => {



      if (r.Type == "Testing" && r.Status == "Accepted") {

        acceptedCountArr.map((s) => {

          if (s.Id == r.AssignedTo._id) {
            s.Test = s.Test + 1;


          }
          return

        })






      }

      else if (r.Type == "Design" && r.Status == "Accepted") {

        acceptedCountArr.map((s) => {

          if (s.Id == r.AssignedTo._id) {
            s.Design = s.Design + 1;
          }

          return

        })


      }

      else if (r.Type == "Development" && r.Status == "Accepted") {

        acceptedCountArr.map((s) => {

          if (s.Id == r.AssignedTo._id) {
            s.Dev = s.Dev + 1;
          }

          return

        })


      }




      console.log("acceptedCountArr: ", acceptedCountArr);
      return

    })




    const cal = req.map((r) => {

      if (r.Accepted == true) {

        tempSetlineChartReqData = [...tempSetlineChartReqData, 1]

      }

      else { tempSetlineChartReqData = [...tempSetlineChartReqData, 0] }




      if (r.Type == "Testing") {

        arr.map((s) => {

          if (s.Id == r.AssignedTo._id) {
            s.Test = s.Test + 1;


          }
          return

        })






      }

      else if (r.Type == "Design") {

        arr.map((s) => {

          if (s.Id == r.AssignedTo._id) {
            s.Design = s.Design + 1;
          }

          return

        })


      }

      else if (r.Type == "Development") {

        arr.map((s) => {

          if (s.Id == r.AssignedTo._id) {
            s.Dev = s.Dev + 1;
          }

          return

        })


      }


      console.log("tempSetlineChartReqData: ", tempSetlineChartReqData);
      return

    })

    console.log("NEWLY MADE:", arr);

    setlineChartReqData(tempSetlineChartReqData)
    setacceptedReqChartData(acceptedCountArr)
    sethighPrioirityReqChartData(highPrioirityCountArr)
    setReqChartData(arr);

    console.log("PRIPORTITY", highPrioirityCountArr)



  }

  const getProject = async (projectname) => {
    console.log("projectname", projectname);
    const response = await axios.post(
      "http://localhost:3500/student/project",
      { Name: projectname.data.Project?.Name },
      {
        withCredentials: true,
      }
    );

    console.log("Project Info: ", response.data);
    setProjectInfo(response.data);
    setGroupMembers(response.data.GroupMembers);
    console.log("Requirements!!!: ", response.data.Requirements);
    setTasks(response.data.Requirements);
    var arr = response.data.GroupMembers.map((i) => { return { "Id": i._id, "Name": i.Name, "Dev": 0, "Test": 0, "Design": 0 } })
    setReqChartData(arr)
    calculateReqChartData(arr, response.data.Requirements)




    console.log("This is oo", arr)



    calculate(response)
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

    getProject(response);
  };


  const PRIORITY_BADGES = [
    { text: "High", color: "danger" },
    { text: "Low", color: "success" },
    { text: "Medium", color: "info" },
    { text: "Accepted", color: "success" },
    { text: "Rejected", color: "danger" },
  ];
  const getTaskColor = (priority) => {
    return PRIORITY_BADGES.find((badge) => badge.text == priority).color;
  };

  const [data, setdata] = useState([0, 0, 0])

  const calculate = (response) => {


    var arr = [0, 0, 0];

    response.data.Requirements.map((task) => {


      if (task.Type == "Design") {
        arr[0] = arr[0] + 1;
      }
      else if (task.Type == "Development") {
        arr[1] = arr[1] + 1;
      }
      else if (task.Type == "Testing") {
        arr[2] = arr[2] + 1;
      }

      return
    })

    setdata(arr)

  }


  const [state] = useState({
    series: [44, 55, 67],
    options: {
      chart: {
        height: 350,
        type: 'radialBar',
      },
      plotOptions: {
        radialBar: {
          dataLabels: {
            name: {
              fontSize: '22px',
            },
            value: {
              fontSize: '16px',
            },
            total: {
              show: true,
              label: 'Total',
              formatter(w) {
                // By default this function returns the average of all series. The below is just an example to show the use of custom formatter function
                return w.globals.series.reduce((a, b) => a + b, 0);
              },
            },
          },
        },
      },
      labels: ['Design', 'Development', 'Testing'],
      stroke: {
        lineCap: 'round',
      },

    },
  });





  return (
    <PageWrapper title={demoPages.sales.subMenu.dashboard.text}>
      <SubHeader>
        <SubHeaderLeft>
          <span className="h4 mb-0 fw-bold">Dashboard </span>
          <SubheaderSeparator />
          <span className="h4 mb-0 fw-bold">Welcome! Lets work together </span>
        </SubHeaderLeft>
        <SubHeaderRight>
          <CommonAvatarTeam>
            {projectInfo != null ? projectInfo.Name : ""}
            <strong> | Team</strong> {studentSelf.Role == null ? "" : studentSelf.Role.substring(4)}
          </CommonAvatarTeam>
        </SubHeaderRight>
      </SubHeader>
      {projectInfo == null ?


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

          <h4 className="mt-5">Check if you are added to any group</h4>


        </div>



        : <Page container="fluid ">
          <div
            style={{
              overflowX: "scroll",
              overflowY: "hidden",
              whiteSpace: "nowrap",
              WebkitOverflowScrolling: "touch",
              position: "relative",
            }}
          >

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
          {tasks.length == 0 ? "" : <div className="row ">
            {studentSelf.Widgets[0] == false ? "" :
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
                  <CardBody isScrollable>
                    <Timeline>
                      {tasks.map((i, key) => (
                        <TimelineItem
                          label={
                            new Date(i.end).toLocaleString(
                              "en-US",

                              { year: "numeric", month: "numeric", day: "numeric" }

                            )

                          }
                          color={getTaskColor(i.Priority)}
                        >
                          {i.Title} - {i.Priority} - {i.AssignedTo?.Name ? i.AssignedTo.Name : "Not Assigned"}
                        </TimelineItem>
                      ))}
                    </Timeline>
                  </CardBody>
                </Card>
              </div>
            }

            {studentSelf.Widgets[1] == false ? "" :
              <div className="col-4">
                <Card stretch>
                  <CardHeader>
                    <CardLabel icon="box" iconColor="danger">
                      <CardTitle tag="h4" className="h5">
                        Test Cases
                      </CardTitle>
                      <CardSubTitle>last 2 weeks</CardSubTitle>
                    </CardLabel>
                  </CardHeader>
                  <CardBody isScrollable>
                    <Timeline>
                      {tasks.map((i, key) => (
                        i.Type == "Testing" ? <TimelineItem
                          label={
                            new Date(i.end).toLocaleString(
                              "en-US",

                              { year: "numeric", month: "numeric", day: "numeric" }

                            )

                          }
                          color={getTaskColor(i.Priority)}
                        >
                          {i.Title} - {i.Priority} - {i.AssignedTo?.Name ? i.AssignedTo.Name : "Not Assigned"}
                        </TimelineItem> : ""
                      ))}
                    </Timeline>
                  </CardBody>
                </Card>
              </div>

            }

            {studentSelf.Widgets[2] == false ? "" :
              <div className="col-4">
                <div className=''>
                  <Card stretch>
                    <CardHeader>
                      <CardLabel icon='DonutLarge'>
                        <CardTitle>
                          Requirement Stats <small>Total</small>
                        </CardTitle>
                        <CardSubTitle>Widget</CardSubTitle>
                      </CardLabel>
                    </CardHeader>
                    <CardBody>
                      <Chart
                        series={data}
                        options={state.options}
                        type={state.options.chart.type}
                        height={state.options.chart.height}
                      />
                    </CardBody>
                  </Card>
                </div>

              </div>
            }

            <div className='col-lg-4'>
              <Card stretch>
                <CardHeader>
                  <CardLabel icon='MultilineChart'>
                    <CardTitle>
                      Requirement Division <small>Bar Chart</small>
                    </CardTitle>
                    <CardSubTitle>Analysis</CardSubTitle>
                  </CardLabel>
                </CardHeader>
                <CardBody>
                  <Chart series={[
                    {
                      name: 'Design',
                      type: 'column',
                      data: [ReqChartData[0]?.Design, ReqChartData[1]?.Design, ReqChartData[2]?.Design],
                    },
                    {
                      name: 'Development',
                      type: 'column',
                      data: [ReqChartData[0]?.Dev, ReqChartData[1]?.Dev, ReqChartData[2]?.Dev],
                    },
                    {
                      name: 'Testing',
                      type: 'column',
                      data: [ReqChartData[0]?.Test - 1, ReqChartData[1]?.Test - 1, ReqChartData[2]?.Test - 1],
                    },
                  ]} options={{
                    chart: {
                      height: 350,
                      type: 'line',
                      stacked: false,
                    },
                    dataLabels: {
                      enabled: false,
                    },
                    stroke: {
                      width: [1, 1, 4],
                    },
                    title: {
                      text: `Started: ${new Date(projectInfo.Requirements[0].start).toLocaleString(
                        "en-US",

                        { year: "numeric", month: "numeric", day: "numeric" }

                      )}`

                      ,

                      align: 'left',
                      offsetX: 110,
                    },
                    xaxis: {
                      categories: [ReqChartData[0]?.Name, ReqChartData[1]?.Name, ReqChartData[2]?.Name],
                    },
                    yaxis: [
                      {
                        axisTicks: {

                          show: true,
                        },
                        axisBorder: {
                          show: true,
                          color: process.env.REACT_APP_INFO_COLOR,
                        },
                        labels: {
                          style: {
                            colors: process.env.REACT_APP_INFO_COLOR,
                          },
                        },
                        title: {
                          text: 'Number of Requirements',
                          style: {
                            color: process.env.REACT_APP_INFO_COLOR,
                          },
                        },
                        tooltip: {
                          enabled: true,
                        },
                      },


                    ],
                    tooltip: {
                      theme: 'dark',
                      fixed: {
                        enabled: true,
                        position: 'topLeft', // topRight, topLeft, bottomRight, bottomLeft
                        offsetY: 30,
                        offsetX: 60,
                      },
                    },
                    legend: {
                      horizontalAlign: 'left',
                      offsetX: 40,
                    },
                  }} type='line' height={350} />
                </CardBody>
              </Card>
            </div>

            <div className='col-lg-4'>
              <Card stretch>
                <CardHeader>
                  <CardLabel icon='ShowChart' iconColor='secondary'>
                    <CardTitle>
                      Project Progress <small>Req</small>
                    </CardTitle>
                    <CardSubTitle>Chart</CardSubTitle>
                  </CardLabel>
                </CardHeader>
                <CardBody>
                  <Chart options={{
                    chart: {
                      type: 'line',
                      height: 350,
                    },
                    stroke: {
                      curve: 'stepline',
                    },
                    dataLabels: {
                      enabled: true,
                    },
                    title: {
                      text: 'Accepted',
                      align: 'left',
                    },
                    markers: {
                      hover: {
                        sizeOffset: 4,
                      },
                    },
                  }} series={[
                    {
                      data: lineChartReqData,
                    },
                  ]} type='line' height={350} />
                </CardBody>
              </Card>
            </div>





            {studentSelf.Widgets[1] == false ? "" :
              <div className="col-4">
                <Card stretch>
                  <CardHeader>
                    <CardLabel icon="book" iconColor="danger">
                      <CardTitle tag="h4" className="h5">
                        Backlogs
                      </CardTitle>
                      <CardSubTitle>Pending</CardSubTitle>
                    </CardLabel>
                  </CardHeader>
                  <CardBody isScrollable>
                    <Timeline>
                      {tasks.map((i, key) => (
                        new Date() > new Date(i.end) ? <TimelineItem
                          label={
                            new Date(i.end).toLocaleString(
                              "en-US",

                              { year: "numeric", month: "numeric", day: "numeric" }

                            )

                          }
                          color={getTaskColor(i.Priority)}
                        >
                          {i.Title} - {i.Priority} - {i.AssignedTo?.Name ? i.AssignedTo.Name : "Not Assigned"}
                        </TimelineItem> : ""
                      ))}
                    </Timeline>
                  </CardBody>
                </Card>
              </div>

            }

            <div className='col-lg-6'>
              <Card stretch>
                <CardHeader>
                  <CardLabel icon='StackedBarChart'>
                    <CardTitle>
                      Assigned Tasks <small>line</small>
                    </CardTitle>
                    <CardSubTitle>Progress</CardSubTitle>
                  </CardLabel>
                </CardHeader>
                <CardBody>
                  <Chart series={[
                    {
                      name: 'Design',

                      data: [acceptedReqChartData[0]?.Design, acceptedReqChartData[1]?.Design, acceptedReqChartData[2]?.Design],
                    },
                    {
                      name: 'Development',

                      data: [acceptedReqChartData[0]?.Dev, acceptedReqChartData[1]?.Dev, acceptedReqChartData[2]?.Dev],
                    },
                    {
                      name: 'Testing',

                      data: [acceptedReqChartData[0]?.Test - 1, acceptedReqChartData[1]?.Test - 1, acceptedReqChartData[2]?.Test - 1],
                    },
                  ]} options={{
                    chart: {
                      type: 'line',
                      height: 430,
                    },
                    plotOptions: {
                      bar: {
                        horizontal: true,
                        dataLabels: {
                          position: 'top',
                        },
                      },
                    },
                    dataLabels: {
                      enabled: true,
                      offsetX: -6,
                      style: {
                        fontSize: '12px',
                        colors: ['#fff'],
                      },
                    },
                    stroke: {
                      show: true,
                      width: 1,
                      colors: ['#fff'],
                    },
                    xaxis: {
                      categories: [ReqChartData[0]?.Name, ReqChartData[1]?.Name, ReqChartData[2]?.Name]
                    },
                  }} type='line' height={460} />
                </CardBody>
              </Card>
            </div>

            <div className='col-lg-6'>
              <Card stretch>
                <CardHeader>
                  <CardLabel icon='StackedBarChart'>
                    <CardTitle>
                      High Priorities <small>bar</small>
                    </CardTitle>
                    <CardSubTitle>Members</CardSubTitle>
                  </CardLabel>
                </CardHeader>
                <CardBody>
                  <Chart series={[
                    {
                      name: 'Design',

                      data: [highPrioirityReqChartData[0]?.Design, highPrioirityReqChartData[1]?.Design, highPrioirityReqChartData[2]?.Design],
                    },
                    {
                      name: 'Development',

                      data: [highPrioirityReqChartData[0]?.Dev, highPrioirityReqChartData[1]?.Dev, highPrioirityReqChartData[2]?.Dev],
                    },
                    {
                      name: 'Testing',

                      data: [highPrioirityReqChartData[0]?.Test - 1, highPrioirityReqChartData[1]?.Test - 1, highPrioirityReqChartData[2]?.Test - 1],
                    },
                  ]} options={{
                    chart: {
                      type: 'bar',
                      height: 430,
                    },
                    plotOptions: {
                      bar: {
                        horizontal: true,
                        dataLabels: {
                          position: 'top',
                        },
                      },

                    },
                    dataLabels: {
                      enabled: true,
                      offsetX: -6,
                      style: {
                        fontSize: '12px',
                        colors: ['#fff'],
                      },
                    },
                    stroke: {
                      show: true,
                      width: 1,
                      colors: ['#fff'],
                    },
                    xaxis: {
                      categories: [ReqChartData[0]?.Name, ReqChartData[1]?.Name, ReqChartData[2]?.Name]
                    },
                  }} type='bar' height={460} />
                </CardBody>
              </Card>
            </div>



          </div>
          }

          <Sprint reload={reload} />
          {/* 
        <RadialBarCustom />
<RadialBarGradient /> */}
        </Page>}
    </PageWrapper>
  );
};

export default DashboardPage;
