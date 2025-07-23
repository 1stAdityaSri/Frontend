import React,{useState,useContext} from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import {UserDataContext} from '../context/UserContext'

const Register = () => {
  const [name, setname] = useState('')
  const [username, setusername] = useState('')
   const [email,setemail]= useState('')
    const [password,setpassword]= useState('')
    const [userdata, setuserdata] = useState({})

    const navigate= useNavigate()

    const {user,setuser}= useContext(UserDataContext)

   const submitHandler = async (e) => {
  e.preventDefault();
  const newUser = {
    name,
    username,
    email,
    password,
  };

  try {
    const response = await axios.post(
      'http://localhost:4000/users/register',
      newUser,
      { withCredentials: true }
    );

    if (response.status >= 200 && response.status < 300) {
      const data = response.data;
      setuser(data.user);
      navigate('/profile');
    }
  } catch (err) {
    console.error("Registration failed:", err.response?.data || err.message);
    alert("Registration failed: " + (err.response?.data || err.message));
  }

  setname('');
  setusername('');
  setemail('');
  setpassword('');
};


  return (
    <div class="w-full h-screen bg-pink-900">
      <h2> Create Account</h2>
     <form onSubmit={(e)=>{
      submitHandler(e)
     }} className="flex flex-col space-y-4 mt-20 p-6 max-w-md mx-auto bg-gradient-to-br from-gray-100 to-gray-500 shadow-2xl rounded-2xl border border-gray-300">
        <input value={username} onChange={(e) => setusername(e.target.value)} type="text" placeholder="username" name="username"/>
        <input value={name} onChange={(e) => setname(e.target.value)} type="text" placeholder="name" name="name"/>
        <input value={email} onChange={(e) => setemail(e.target.value)} type="email" placeholder="email" name="email"/>
        <input value={password} onChange={(e) => setpassword(e.target.value)} type="password" placeholder="password" name="password"/>
        <input type="submit" name="create account" value="create account" id=""/>

     </form>
          <Link to="/login">Login Here</Link>

   </div>
  )
}

export default Register