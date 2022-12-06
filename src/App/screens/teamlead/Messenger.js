import React, { useCallback, useEffect, useLayoutEffect, useState, useContext, useRef } from "react";
import moment from 'moment';
import { useNavigate } from 'react-router-dom';
import SubHeader, { SubHeaderLeft, SubHeaderRight } from '../../../layout/SubHeader/SubHeader';
import Button from '../../../components/bootstrap/Button';
import Page from '../../../layout/Page/Page';
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
import PageWrapper from '../../../layout/PageWrapper/PageWrapper';
import Chat, { ChatAvatar, ChatGroup, ChatListItem } from '../../../components/Chat';
import InputGroup from '../../../components/bootstrap/forms/InputGroup';
import Textarea from '../../../components/bootstrap/forms/Textarea';
import USERS from '../../../common/data/userDummyData';
import Icon from '../../../components/icon/Icon';
import ThemeContext from '../../../contexts/themeContext';
import { demoPages } from '../../../menu';
import CHATS from '../../../common/data/chatDummyData';
import CommonChatStatus from '../../../pages/common/CommonChatStatus';
import NewConversationModal from './NewConversationModal';
import axios from "axios";
import { Cookies } from "react-cookie";
import jwt_decode from "jwt-decode";
axios.defaults.withCredentials = true;
import useAuth from "../../../hooks/useAuth";
import { io } from "socket.io-client";


import EmojiPicker from 'emoji-picker-react';
import { Theme } from 'emoji-picker-react';

import { auto } from "@popperjs/core";






const Messenger = () => {

	/// Video Call






	// My code

	const [studentSelf, setstudentSelf] = useState([]);
	const [user, setUser] = useState([]);

	const [Friend, setFriend] = useState([]);

	const [NumberofStudents, setNumberofStudents] = useState([]);

	const [editModalStatus, setEditModalStatus] = useState(false);

	const [conversations, setConversations] = useState([]);
	const [currentChat, setCurrentChat] = useState(null);
	const [messages, setMessages] = useState([]);
	const [newMessage, setNewMessage] = useState("");
	const [arrivalMessage, setArrivalMessage] = useState(null);
	const [onlineUsers, setOnlineUsers] = useState([]);
	const socket = useRef();
	const scrollRef = useRef();

	const [allStudents, setAllStudents] = useState([])


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

	const getAllStudents = async () => {

		const res = await axios.get("http://localhost:3500/student/getAllStudents",
			{
				withCredentials: true,
			});

		console.log("CONVERSATINO USERS", conversations)

		setAllStudents(res.data)
		console.log("WE ARE ALL STUDENTS", res.data)



	}

	useEffect(() => {
		arrivalMessage &&
			currentChat?.members.includes(arrivalMessage.sender) &&
			setMessages((prev) => [...prev, arrivalMessage]);
		console.log("HIsasas")
	}, [arrivalMessage, currentChat]);

	useEffect(() => {
		socket.current.emit("addUser", studentSelf._id);
		socket.current.on("getUsers", (users) => {
			console.log("users")

			console.log(users)

		});
	}, [studentSelf]);





	useEffect(() => {
		const getConversations = async () => {
			try {
				const res = await axios.get("http://localhost:3500/chat/conversations/" + studentSelf._id);
				setConversations(res.data);
				setNumberofStudents(res.data.length)
				console.log("Hi")
				console.log(res.data)
				console.log("Bye")

			} catch (err) {
				console.log(err);
			}
		};
		getConversations();
	}, [studentSelf._id]);



	useEffect(() => {
		console.log("NEWWW")
		const getMessages = async () => {


			try {
				const res = await axios.get("http://localhost:3500/chat/messages/" + currentChat?._id);

				setMessages(res.data);
				console.log("Texting Start")
				console.log(res.data)
				console.log("Texting End")

			} catch (err) {
				console.log(err);
			}
		}

		getMessages();

	}, [currentChat, newMessage, arrivalMessage]);



	const sendMessage = async (e) => {
		e.preventDefault();
		const message = {
			sender: studentSelf,
			text: newMessage,
			conversationId: currentChat,
			isReply: true
		};



		const receiverId = currentChat.members.find(
			(member) => member._id !== studentSelf._id
		);

		const notification = {
			title: "Message",
			content: newMessage,
			sender: studentSelf.Name,
			senderImg: studentSelf.ProfilePicture,
			receiverId: receiverId

		}


		socket.current.emit("sendMessage", {
			senderId: studentSelf,
			receiverId,
			text: newMessage,
		});

		socket.current.emit("sendNotification", {
			senderId: studentSelf,
			receiverId,
			title: "Message",
			content: newMessage,
		});

		try {
			const res = await axios.post("http://localhost:3500/chat/messages", message);
			setMessages([...messages, res.data]);
			setNewMessage("");
			getMessages(res);


		} catch (err) {
			console.log(err);
		}

		try {
			const res = await axios.post("http://localhost:3500/notification", notification);
			console.log(res)



		} catch (err) {
			console.log(err);
		}


	}






	useEffect(() => {
		scrollRef.current?.scrollIntoView({ behavior: "smooth" });
	}, [messages]);



	//---------------------------------------

	useEffect(() => {
		getstudentSelf();
		getAllStudents()

	}, []);



	const reload = () => {
		getstudentSelf()
		const getConversations = async () => {
			try {
				const res = await axios.get("http://localhost:3500/chat/conversations/" + studentSelf._id);
				setConversations(res.data);
				setNumberofStudents(res.data.length)
				console.log("Hi")
				console.log(res.data)
				console.log("Bye")

			} catch (err) {
				console.log(err);
			}
		};
		getConversations();
	}
	const { auth, setAuth } = useAuth();

	console.log("AUTHHHHDAN", auth);

	const getstudentSelf = async () => {
		const cookies = new Cookies();
		const token = cookies.get("jwt");

		var decoded = jwt_decode(token);
		setUser(decoded)

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



	const ChatRoom = () => {


		if (user.Role == "TeamLead") {



			navigate(`/teamlead/messengercall`);

		}
		else if (user.Role == "TeamMember") {


			navigate(`/teammember/messengercall`);


		}


	}


	//--------------------------------------------------------------------------

	const navigate = useNavigate();

	const TABS = {
		CHLOE: USERS.CHLOE,
		GRACE: USERS.GRACE,
		JANE: USERS.JANE,
		RYAN: USERS.RYAN,
		ELLA: USERS.ELLA,
		SAM: USERS.SAM,
	};
	const [activeTab, setActiveTab] = useState(TABS.CHLOE);

	function getMessages(ACTIVE_TAB) {
		return messages ? messages : CHATS.CHLOE_VS_JOHN;

	}

	const { mobileDesign } = useContext(ThemeContext);
	const [listShow, setListShow] = useState(true);

	const getListShow = (TAB_NAME) => {
		setActiveTab(TAB_NAME);
		if (mobileDesign) {
			setListShow(false);
		}
	};

	return (
		<PageWrapper title={demoPages.chat.subMenu.withListChat.text}>
			<SubHeader>
				<SubHeaderLeft>
					<span>
						<Icon icon='Info' className='me-2' size='2x' color='danger' />
						<span className='text-muted'>
							You have <Icon icon='Chat5' color='danger' className='mx-1' size='lg' />{' '}
							2 unread messages.
						</span>
					</span>
				</SubHeaderLeft>
				<SubHeaderRight>
					<Button className='text-muted bg-yellow-100 hover:bg-yellow-300'
						onClick={ChatRoom}>
						<Icon icon='Call' color='success' className='mx-1' size='lg' />{' '}
						Join Room
					</Button>					{!listShow && (
						<Button
							color='info'
							isLight
							icon='ChevronLeft'
							onClick={() => {
								setListShow(true);
							}}>
							Back to List
						</Button>
					)}
				</SubHeaderRight>
			</SubHeader>
			<Page>
				<div className='row h-100'>
					{(listShow || !mobileDesign) && (
						<div className='col-lg-4 col-md-6'>
							<Card stretch className='overflow-hidden'>
								<CardBody isScrollable className='p-0'>
									<Card shadow='none' className='mb-0'>
										<CardHeader className='sticky-top w-[100%]'>
											<CardLabel className="flex w-[100%]" icon='AccountCircle' iconColor='success'>
												<div className="flex flex-row justify-between w-[360px]" >
													<div className="flex flex-col">


														<CardTitle className="flex" >Students</CardTitle>
														<CardSubTitle className="flex">
															{`${NumberofStudents}` + " Participants"}
														</CardSubTitle>
													</div>

													<Button
														icon='Add'
														color='primary'
														isLight
														className='flex '
														onClick={() => setEditModalStatus(true)}>
														New Conversation
													</Button>
												</div>


											</CardLabel>
										</CardHeader>
										<CardBody className='border-bottom border-light'>
											<div className='row'>

												{conversations.map((c) => (
													//findFriend(c)



													c.members[0]._id == studentSelf._id ? (

														<ChatListItem
															onClick={() => { setCurrentChat(c), setFriend(c.members[1]) }}
															isActive={activeTab === TABS.CHLOE}
															src={c.members[1].ProfilePicture}
															srcSet={c.members[1].ProfilePicture}
															name={c.members[1].Name}
															surname={""}

															isOnline={USERS.CHLOE.isOnline}
															color={USERS.CHLOE.color}
															lastSeenTime={moment()
																.add(-1, 'hour')
																.fromNow()}

															latestMessage={
																c.members[1].Email
															}
														/>) :
														<ChatListItem
															onClick={() => { setCurrentChat(c), setFriend(c.members[0]) }}
															isActive={activeTab === TABS.CHLOE}
															src={c.members[0].ProfilePicture}
															srcSet={c.members[0].ProfilePicture}
															name={c.members[0].Name}
															surname={""}
															isOnline={USERS.CHLOE.isOnline}
															color={USERS.CHLOE.color}
															lastSeenTime={moment()
																.add(-8, 'hour')
																.fromNow()}
															latestMessage={
																c.members[0].Email
															}
														/>




												)
												)
												}


											</div>
										</CardBody>
									</Card>

								</CardBody>
								<CardFooter>
									<CardFooterLeft className='w-100'>
										<Button
											icon='Logout'
											color='danger'
											isLight
											className='w-100 p-3'
											onClick={() => navigate(`../${demoPages.login.path}`)}>
											Logout
										</Button>



									</CardFooterLeft>
								</CardFooter>
							</Card>
						</div>
					)}
					{(!listShow || !mobileDesign) && (
						<div className='col-lg-8 col-md-6'>
							<Card stretch>


								<CardHeader>
									<CardActions>
										<div className='d-flex align-items-center'>
											<ChatAvatar
												src={Friend.ProfilePicture}
												srcSet={Friend.ProfilePicture}


												// eslint-disable-next-line react/jsx-props-no-spreading
												className='me-3'
											/>


											<div className='fw-bold'>
												{`${Friend.Name}`}
											</div>


										</div>
									</CardActions>
								</CardHeader>

								<CardBody isScrollable>

									<Chat>
										{getMessages(activeTab).map((msg) => (


											msg.sender._id == studentSelf._id ? (


												<ChatGroup
													messages={msg.text}
													user={msg.sender}

													isReply={true}
												/>
											) :
												<ChatGroup
													messages={msg.text}
													user={msg.sender}

													isReply={false}
												/>
										))}
									</Chat>




								</CardBody>
								<CardFooter className='d-block'>
									<InputGroup>
										{/* <EmojiPicker height={300} width={400} Theme={auto} searchDisabled={true} skinTonesDisabled={true} 
									 disableAutoFocus={true} native/> */}
										<Textarea
											onChange={(e) => setNewMessage(e.target.value)}
											value={newMessage}
										/>
										<Button color='info' icon='Send'
											onClick={sendMessage}>
											SEND
										</Button>

									</InputGroup>


								</CardFooter>


							</Card>
						</div>


					)}
				</div>
			</Page>


			<NewConversationModal
				projectInfo={allStudents}
				setIsOpen={setEditModalStatus}
				isOpen={editModalStatus}
				reload={reload}
				id={0}
			/>



		</PageWrapper>
	);
};

export default Messenger;
