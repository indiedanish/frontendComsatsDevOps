import * as React from 'react';

function SvgBackspaceReverse(props) {
	return (
		<svg
			xmlns='http://www.w3.org/2000/svg'
			width='1em'
			height='1em'
			fill='currentColor'
			className='svg-icon'
			viewBox='0 0 16 16'
			{...props}>
			<path d='M9.854 5.146a.5.5 0 010 .708L7.707 8l2.147 2.146a.5.5 0 01-.708.708L7 8.707l-2.146 2.147a.5.5 0 01-.708-.708L6.293 8 4.146 5.854a.5.5 0 11.708-.708L7 7.293l2.146-2.147a.5.5 0 01.708 0z' />
			<path d='M2 1a2 2 0 00-2 2v10a2 2 0 002 2h7.08a2 2 0 001.519-.698l4.843-5.651a1 1 0 000-1.302L10.6 1.7A2 2 0 009.08 1H2zm7.08 1a1 1 0 01.76.35L14.682 8l-4.844 5.65a1 1 0 01-.759.35H2a1 1 0 01-1-1V3a1 1 0 011-1h7.08z' />
		</svg>
	);
}

export default SvgBackspaceReverse;
