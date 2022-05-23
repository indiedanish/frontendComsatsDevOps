import React, { memo,useEffect,useLayoutEffect, useState } from 'react';
import PropTypes from 'prop-types';
import Avatar, { AvatarGroup } from '../Avatar';
import USERS from '../../common/data/userDummyData';
import axios from 'axios'

import UserImage2Webp from '../../assets/img/wanna/wanna2.webp';

import femaleAvatar from '../../assets/img/wanna/FemaleAvatar.png';
import maleAvatar from '../../assets/img/wanna/MaleAvatar.png';



const CommonAvatarTeam = ({ children, isAlignmentEnd }) => {


	var [use, setuse] = useState([]);

	useEffect(() => {

	

		 const fetchData = async () => {
			const response = await axios.get("http://localhost:4000/student/getStudents")
			console.log("ssss",response.data[0].Email)
			 setuse(response.data);
			
		  }
		
		  // call the function
		  fetchData()
	},[])
	
	
	
	return (
		<>
			{children && !isAlignmentEnd && <span className='me-3'>{children}</span>}
			<AvatarGroup>

				{use.map(user => (	<Avatar
					src={user.Gender==true?maleAvatar:femaleAvatar}
					srcSet={user.Gender==true?maleAvatar:femaleAvatar}
					color='info'
					userName={user.Name}
				/>))}
			
			</AvatarGroup>
			{children && isAlignmentEnd && <span>{children}</span>}
		</>
	);
};
CommonAvatarTeam.propTypes = {
	children: PropTypes.node,
	isAlignmentEnd: PropTypes.bool,
};
CommonAvatarTeam.defaultProps = {
	children: null,
	isAlignmentEnd: false,
};

export default memo(CommonAvatarTeam);
