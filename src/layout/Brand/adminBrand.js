import React from 'react';

const AdminBrand = () => {
	return (
		// <div className='wrap-logo-title' style={{ textAlign: 'center' }}>
		// 	<div className='comsats-logo'>
		// 		<img
		// 			style={{ width: 50, height: "auto", paddingTop: 10 , paddingBottom: 10 }}
		// 			src='https://seeklogo.com/images/C/comsats-university-islamabad-logo-B7C2E461B5-seeklogo.com.png'
		// 			alt='new'
		// 		/>
		// 		<h5 className='title'>Comsats DevOps Portal</h5>
		// 	</div>
		// </div>

		<div className='brand ml-2 mt-2'>
			<img
				style={{ width: 50, height: 'auto', paddingTop: 10, paddingBottom: 10 }}
				src='https://seeklogo.com/images/C/comsats-university-islamabad-logo-B7C2E461B5-seeklogo.com.png'
				alt='new'
			/>

			<div className='brand-logo mt-3'>
				<h1 className='brand-title '>
					<div className='wrap-logo-title' style={{ textAlign: 'center' }}>
						<div className='comsats-logo'>
							<h5 className='title'>CUI Admin Portal</h5>
						</div>
					</div>
				</h1>
			</div>
		</div>
	);
};

export default AdminBrand;
