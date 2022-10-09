import React, { useContext, useRef, useState } from 'react';
import classNames from 'classnames';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import TeamLeadBrand from '../Brand/TeamLeadBrand';
import Navigation, { NavigationLine } from '../Navigation/Navigation';
import User from '../User/User';
import {  committeeMenuSidebar } from '../../menu';
import ThemeContext from '../../contexts/themeContext';
import Card, { CardBody } from '../../components/bootstrap/Card';

import Hand from '../../assets/img/hand.png';
import HandWebp from '../../assets/img/hand.webp';
import Icon from '../../components/icon/Icon';
import Button from '../../components/bootstrap/Button';
import Tooltips from '../../components/bootstrap/Tooltips';
import useDarkMode from '../../hooks/useDarkMode';
import useAsideTouch from '../../hooks/useAsideTouch';

const CommitteeSidebar = () => {
	const { asideStatus, setAsideStatus } = useContext(ThemeContext);

	const { asideStyle, touchStatus, hasTouchButton, asideWidthWithSpace, x } = useAsideTouch();

	const isModernDesign = process.env.REACT_APP_MODERN_DESGIN === 'true';

	const constraintsRef = useRef(null);

	const [doc, setDoc] = useState(false);

	const { t } = useTranslation(['translation', 'menu']);

	const { darkModeStatus } = useDarkMode();

	return (
		<>
			<motion.aside
				style={asideStyle}
				className={classNames(
					'aside',
					{ open: asideStatus },
					{
						'aside-touch-bar': hasTouchButton && isModernDesign,
						'aside-touch-bar-close': !touchStatus && hasTouchButton && isModernDesign,
						'aside-touch-bar-open': touchStatus && hasTouchButton && isModernDesign,
					},
				)}>
				<div className='aside-head'>
				<div className='brand'>
			<img
				style={{ width: 50, height: 'auto', paddingTop: 10, paddingBottom: 10 }}
				src='https://seeklogo.com/images/C/comsats-university-islamabad-logo-B7C2E461B5-seeklogo.com.png'
				alt='new'
			/>

			<div className='brand-logo'>
				<h1 className='brand-title '>
					<div className='wrap-logo-title' style={{ textAlign: 'center' }}>
						<div className='comsats-logo'>
							<h5 className='title'>Commitee Portal</h5>
						</div>
					</div>
				</h1>
			</div>
		</div>
				</div>
				<div className='aside-body'>
					<Navigation menu={committeeMenuSidebar} id='aside-dashboard' />
				

				

				</div>
				
			</motion.aside>
			{asideStatus && hasTouchButton && isModernDesign && (
				<>
					<motion.div className='aside-drag-area' ref={constraintsRef} />
					<Tooltips title='Toggle Aside' flip={['top', 'right']}>
						<motion.div
							className='aside-touch'
							drag='x'
							whileDrag={{ scale: 1.2 }}
							whileHover={{ scale: 1.1 }}
							dragConstraints={constraintsRef}
							// onDrag={(event, info) => console.log(info.point.x, info.point.y)}
							dragElastic={0.1}
							style={{ x, zIndex: 1039 }}
							onClick={() => x.set(x.get() === 0 ? asideWidthWithSpace : 0)}
						/>
					</Tooltips>
				</>
			)}
		</>
	);
};

export default CommitteeSidebar;
