import React, { useContext } from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import Content from '../Content/Content';
import WrapperOverlay from './WrapperOverlay';
import HeaderRoutes from '../Header/HeaderRoutes';
import FooterRoutes from '../Footer/FooterRoutes';
import ThemeContext from '../../contexts/themeContext';
import { Route, Routes } from "react-router-dom";
import PAGE_404 from '../../pages/presentation/auth/Page404';
import RequireAuth from '../Content/RequireAuth';


export const WrapperContainer = ({ children, className, ...props }) => {
	const { rightPanel } = useContext(ThemeContext);
	return (
		<div
			className={classNames(
				'wrapper',
				{ 'wrapper-right-panel-active': rightPanel },
				className,
			)}
			// eslint-disable-next-line react/jsx-props-no-spreading
			{...props}>
			{children}
		</div>
	);
};
WrapperContainer.propTypes = {
	children: PropTypes.node.isRequired,
	className: PropTypes.string,
};
WrapperContainer.defaultProps = {
	className: null,
};

// page autherization when at login and wants to show Page404

const Wrapper = () => {
	return (
		<>


			<WrapperContainer>
				<Content />


				


				<HeaderRoutes />
				<FooterRoutes />
			</WrapperContainer>
			<WrapperOverlay />
		</>
	);
};

export default Wrapper;
