import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Login from './pages/Login'
import Register from './pages/Register'
import Profile from './pages/Profile'
import Edit from './pages/Edit'
import Feed from './pages/Feed'
import Kisika from './pages/Kisika'


import { UserDataContext } from './context/UserContext'

const App = () => {
  return (
    
    <div>
      <Routes>
          <Route path='/login' element={<Login/>}/>
          <Route path='/register' element={<Register/>}/>
          <Route path='/profile' element={<Profile/>}/>
          <Route path='/edit/:id' element={<Edit />} />
          <Route path='/' element={<Feed />} />
           <Route path='/kisika' element={<Kisika />} />


      </Routes>
    </div>
  )
}

export default App