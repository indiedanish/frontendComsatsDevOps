import React from 'react';
import Header, { HeaderLeft } from '../../../layout/Header/Header';
import Avatar from '../../../components/Avatar';
import UserImage2Webp from '../../../assets/img/wanna/wanna1.webp';
import UserImage2 from '../../../assets/img/wanna/wanna1.png';
import CommonHeaderRight from './CommonHeaderRight';
import useAuth from '../../../hooks/useAuth';

const ProfilePageHeader = () => {
	const { auth } = useAuth();


	return (
		<Header>
			<HeaderLeft>
				<div className='col d-flex align-items-center'>
					<div className='me-3'>
						<Avatar
							srcSet={UserImage2Webp}
							src={UserImage2}
							size={48}
							color='primary'
						/>
					</div>
					<div>
						<div className='fw-bold fs-6 mb-0'>{auth.Role == "Supervisor" || "Committee" ? auth.Email : auth.RegNo}</div>
						<div className='text-muted'>
							<small>{auth.Role}</small>
						</div>
					</div>
				</div>
			</HeaderLeft>
			<CommonHeaderRight />
		</Header>
	);
};

export default ProfilePageHeader;
