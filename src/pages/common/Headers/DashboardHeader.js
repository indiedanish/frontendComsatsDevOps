import React from 'react';
import Header, { HeaderLeft } from '../../../layout/Header/Header';
import CommonHeaderChat from './CommonHeaderChat';
import Search from '../../../components/Search';
import CommonHeaderRight from './CommonHeaderRight';

const DashboardHeader = () => {
	return (
		<Header>
			<HeaderLeft>
				<Search />
			</HeaderLeft>
			{/* FOR CHAT ICON AT HEADER */}
			{/* <CommonHeaderRight afterChildren={<CommonHeaderChat />} />  */}
						<CommonHeaderRight  />
		</Header>
	);
};

export default DashboardHeader;
