import React, { lazy, useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import contents from '../../routes/contentRoutes';

const PAGE_404 = lazy(() => import('../../pages/presentation/auth/Page404'));

import { Navigate, Outlet } from 'react-router-dom'

const useAuth = () => {


	//   if(user.user=="admin"){
	// 	console.log("AUTH SUCESS")
	//     return true
	//   } else {
	//     return false
	//   }
}
const ContentRoutes = () => {
	const [user, setuser] = useState('admin')

	console.log(contents)
	const auth = useAuth()//to authenticate users
	return true ? //randomly added true
		<Routes>


			{user == "admin" ?

				contents.presentation.map((page) => (
					// eslint-disable-next-line react/jsx-props-no-spreading
					<Route key={page.path} {...page} />
				))

				:
				contents.student.map((page) => (
					// eslint-disable-next-line react/jsx-props-no-spreading
					<Route key={page.path} {...page} />
				))

			}


			{
				false ?

					<Route path='*' element={<PAGE_404 />} />
					:
					"not logged in"
			}


		</Routes> :
		<Navigate to="/login" />


};

export default ContentRoutes;
