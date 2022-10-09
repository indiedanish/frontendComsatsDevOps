import React from 'react'
import useAuth from '../../../../hooks/useAuth'

const Dashboard = () => {

  const { auth, setAuth } = useAuth()
  return (
    <h1>
      IM {auth.Role}
    </h1>
  )
}

export default Dashboard
