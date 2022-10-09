import React from 'react'
import useAuth from '../../../../hooks/useAuth'

const Dashboard = () => {

  const { auth, setAuth } = useAuth()
  return (
    <div>
      IM {auth.Role}
    </div>
  )
}

export default Dashboard
