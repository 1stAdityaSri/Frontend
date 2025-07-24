import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Login from './pages/Login'
import Register from './pages/Register'
import Profile from './pages/Profile'
import Edit from './pages/Edit'
import Feed from './pages/Feed'
import Someoneprofile from './pages/Someoneprofile'
import { CopilotKit } from "@copilotkit/react-core"; 

import { UserDataContext } from './context/UserContext'

const App = () => {
  return (
    
    <div>
<CopilotKit publicApiKey={process.env.REACT_APP_KEY}>
      <Routes>
          <Route path='/login' element={<Login/>}/>
          <Route path='/register' element={<Register/>}/>
          <Route path='/profile' element={<Profile/>}/>
          <Route path='/edit/:id' element={<Edit />} />
          <Route path='/' element={<Feed />} />
           <Route path='/someoneprofile/:id' element={<Someoneprofile />} />
      </Routes>
        </CopilotKit>


    </div>
  )
}

export default App