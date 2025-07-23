import React,{useState,useContext} from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import {UserDataContext} from '../context/UserContext'

const Login = () => {
  const [email,setemail]= useState('')
  const [password,setpassword]= useState('')
  const [userdata, setuserdata] = useState({})
  const navigate= useNavigate()
    
 const {user,setuser}= useContext(UserDataContext)

  const submitHandler=async(e)=>{
    e.preventDefault();
    const loginData = {
    email: email,
    password: password
  };
   const response = await axios.post(
  'http://localhost:4000/users/login',
  loginData,
  { withCredentials: true }
);
console.log(loginData)

   if (response.status >= 200 && response.status < 300) {
  setuser(response.data.user); // Save user data in context
  console.log(response.data.user)
  navigate('/');
}
    
    setemail('')
    setpassword('')
  }

  return (
    <div className="w-full h-screen bg-pink-900">
      <h2> login Account</h2>
     <form onSubmit={(e)=>{
      submitHandler(e)
     }} className="flex flex-col space-y-4 mt-20 p-6 max-w-md mx-auto bg-gradient-to-br from-gray-100 to-gray-500 shadow-2xl rounded-2xl border border-gray-300" method="post" action="/login">

        <input required value={email}  onChange={(e)=>setemail(e.target.value)} type="email" placeholder="email" name="email"/>
        <input required value={password}  onChange={(e)=>setpassword(e.target.value)} type="password" placeholder="password" name="password"/>
        <input type="submit" name="login account" value="login account" id=""/>

     </form>

     <Link to="/register">Register Here</Link>
   </div>
  )
}

export default Login