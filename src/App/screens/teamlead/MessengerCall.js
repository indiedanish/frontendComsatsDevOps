import React, { useCallback, useEffect, useLayoutEffect, useState, useContext, useRef } from "react";
import { useNavigate } from 'react-router-dom';
import SubHeader, { SubHeaderLeft, SubHeaderRight } from '../../../layout/SubHeader/SubHeader';
import Button from '../../../components/bootstrap/Button';
import Page from '../../../layout/Page/Page';

import PageWrapper from '../../../layout/PageWrapper/PageWrapper';

import Icon from '../../../components/icon/Icon';
import ThemeContext from '../../../contexts/themeContext';
import Card, {
	CardActions,
	CardBody,
	CardFooter,
	CardFooterLeft,
	CardHeader,
	CardLabel,
	CardSubTitle,
	CardTitle,
} from '../../../components/bootstrap/Card';

import CommonChatStatus from '../../../pages/common/CommonChatStatus';

import axios from "axios";
import { Cookies } from "react-cookie";
import jwt_decode from "jwt-decode";
axios.defaults.withCredentials = true;
import useAuth from "../../../hooks/useAuth";
import { io } from "socket.io-client";
import AgoraUIKit, { PropsInterface } from 'agora-react-uikit'





const MessengerCall = () => {

	/// Video Call

	const [videoCall, setVideoCall] = useState(true);
	const rtcProps = {
		appId: '7a35401ec8d54433b64a8438e9fcaabc',
		channel: 'Test', // your agora channel
		token: '007eJxTYDAS1d27tW21qA7PhfuaSdv1+2awPTl0bxpTZMMXpabTNesVGMwTjU1NDAxTky1STE1MjI2TzEwSLUyMLVIt05ITE5OS1U/1JjcEMjJEZr5hYIRCEJ+FISS1uISBAQAT7x89',  // use null or skip if using app in testing mode
	};
	const callbacks = {
		EndCall: () => setVideoCall(false),
	};



	// My code

	const [studentSelf, setstudentSelf] = useState([]);



	const socket = useRef();
	const scrollRef = useRef();


	useEffect(() => {
		socket.current = io("ws://localhost:8900");
		socket.current.on("getMessage", (data) => {
			setArrivalMessage({
				sender: data.senderId,
				text: data.text,
				createdAt: Date.now(),
			});
		});
	}, []);



	useEffect(() => {
		socket.current.emit("addUser", studentSelf._id);
		socket.current.on("getUsers", (users) => {
			console.log("users")

			console.log(users)

		});
	}, [studentSelf]);



//---------------------------------------

useEffect(() => {
	getstudentSelf();


}, []);




const { auth, setAuth } = useAuth();

console.log("AUTHHHHDAN", auth);

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




//--------------------------------------------------------------------------

const navigate = useNavigate();

const ChatRoom = () => {

	navigate(`/teamlead/messenger`);


}


return (
	<PageWrapper title={"Video Chat"}>
		<SubHeader>
			<SubHeaderLeft>
				<span>
					<Icon icon='Info' className='me-2' size='2x' color='danger' />
					<span className='text-muted'>
						<Icon icon='Chat5' color='danger' className='mx-1' size='lg' />{' '}
						Chat Room
					</span>
				</span>
			</SubHeaderLeft>
			<SubHeaderRight>
			<Button className='text-muted bg-red-100 hover:bg-red-300'
				onClick={ChatRoom}>
							 <Icon icon='Call' color='danger' className='mx-1' size='lg' />{' '}
							 Leave Room
						</Button>	

			</SubHeaderRight>
		</SubHeader>
		<Page>
			<div className='row h-100'>

				<div className='col-lg-12 col-md-12'>
					<Card stretch>


						<div style={{ display: 'flex', width: '90vw', height: '90vh'}}>
							{videoCall ? (
								<AgoraUIKit
									rtcProps={rtcProps}
									callbacks={callbacks} />
							) :
								<Button color='info' icon='Meeting'
									onClick={setVideoCall(!videoCall)}>
									SEND
								</Button>
							}
						</div>

					</Card>
				</div>


			</div>
		</Page>
	</PageWrapper>
);
};

export default MessengerCall;
