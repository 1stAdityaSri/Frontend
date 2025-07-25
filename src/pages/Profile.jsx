import React, { useContext, useEffect, useState } from 'react';
import { UserDataContext } from "../context/UserContext";
import axios from 'axios'
import { Link, useNavigate } from 'react-router-dom'
import { IoArrowBack } from "react-icons/io5";
import { IoArrowBackOutline } from "react-icons/io5";

const Profile = () => {
  const { user, setuser } = useContext(UserDataContext);
  const [posts, setPosts] = useState([]);
  const navigate = useNavigate()

  const logouthandler = async () => {
    try {
      await axios.get(`${process.env.REACT_APP_URL}/users/logout`, {
        withCredentials: true
      });

      // Clear user context
      setuser(null);

      // Navigate to login page
      navigate("/login");
    } catch (err) {
      console.error("Logout failed", err);
    }
  }
  ///////////////////////////////////////////////////////////////////////////////////////////////////////
  const uploadhandler = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("image", e.target.image.files[0]);
    console.log("hua upload")
    try {
      const res = await axios.post(
        `${process.env.REACT_APP_URL}/users/upload`, formData, { headers: { "Content-Type": "multipart/form-data" }, withCredentials: true });

      // Refresh the page or refetch profile info
      window.location.reload();
    } catch (err) {
      console.error("Upload failed", err);
    }
  }
  ///////////////////////////////////////////////////////////////////////////////////////////////////////////

  const posthandler = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("content", e.target.content.value);

    if (e.target.image.files[0]) {
      formData.append("image", e.target.image.files[0]);
    }

    try {
      await axios.post(
        `${process.env.REACT_APP_URL}/users/post`,
        formData,
        {
          withCredentials: true,
          headers: { "Content-Type": "multipart/form-data" }
        }
      );

      window.location.reload(); // or fetchPosts();
    } catch (err) {
      console.error("Post creation failed", err);
    }
  };

  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  const likehandler = async (e, postId) => {
    e.preventDefault();
    try {
      await axios.get(
        `${process.env.REACT_APP_URL}/users/like/${postId}`,
        { withCredentials: true }
      );

      // Update local state instead of reloading
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post._id === postId
            ? {
              ...post,
              likes: post.likes.includes(user._id)
                ? post.likes.filter((id) => id !== user._id) // remove like
                : [...post.likes, user._id], // add like
            }
            : post
        )
      );
    } catch (err) {
      console.error("Like failed", err);
    }
  };

  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // Fetch posts of logged-in user
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_URL}/users/profile`,
          { withCredentials: true }
        );
        setPosts(response.data.posts);
        setuser(response.data.user); // ✅ set the user here
        console.log("User from backend:", response.data.user);
      } catch (error) {
        console.error("Failed to fetch posts:", error);
      }
    };

    fetchPosts();
  }, []);
  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  if (!user) return <div className="text-white text-center p-10">Loading profile...</div>;


  const imageSrc = user?.profilepic ? user.profilepic : "default.png";
  return (
    <div className="bg-black text-white w-full h-full p-4 flex flex-col">
      <div className="w-full flex justify-between">
        <Link to="/" className=''> <IoArrowBackOutline size={30} /></Link>
       
        <button onClick={logouthandler} className="bg-white text-black px-4 py-2 rounded-2xl">
          Logout
        </button>
      </div>
      <div className=" rounded-lg">


        <div className='flex flex-row font-bold' >
          <img className="w-20 h-20 rounded-full object-cover" src={`${process.env.REACT_APP_URL}/images/uploads/${user?.profilepic || "default.png"}`} alt="Profile" />
          <h1 className=" mt-5 ml-20">Followers</h1>
          <h1 className="  mt-5 ml-5">{user.followers.length}</h1>
          <h1 className="mt-5 ml-20">Following</h1>
          <h1 className=" mt-5 ml-5 ">{user.following.length}</h1>

        </div>

      </div>
        <p1 className="mt-2">this is my bio how we do it yo yo my name is aditya  </p1>
      <form onSubmit={uploadhandler} className="my-4 " encType="multipart/form-data">
        <input type="file" name="image" className='rounded-3xl bg-gradient-to-r from-rose-400 to-orange-300'  accept="image/*" required />
        <button type="submit" className="ml-2 bg-gradient-to-r from-violet-600 to-orange-300 text-white px-3 py-1 rounded">
          Change DP
        </button>
      </form>

      <h1>Welcome {user?.name}</h1>
      <h5>You can create a new post</h5>

      <form onSubmit={posthandler} encType="multipart/form-data" className="flex flex-col">

        <textarea className=" p-3 text-gray-300 rounded-md bg-gray-700" placeholder="write here" name="content" />
        <input  type="file" name="image" accept="image/*" className="my-2 w-min rounded-3xl bg-gradient-to-r from-rose-400 to-orange-300 " />
        <input className="mt-3 bg-gradient-to-r from-violet-600 to-orange-300 rounded-md w-fit px-3 py-1" type="submit" value="Post" />
      </form>


      <div className="posts  mt-10">
        <h3 className="ml-5">Your posts</h3>
        <div className="postcontainer text-white">
          {posts.length > 0 ? posts.reverse().map((post) => (
            <div key={post._id} className="post bg-gradient-to-r from-violet-600 to-pink-700 shadow-2xl text-white rounded-md mx-3 p-3 my-3">
              <h4>@{user?.username}</h4>

              {post.image && (
                <img
                  src={`${process.env.REACT_APP_URL}/images/uploads/${post.image}`}
                  alt="Post"
                  className="w-full mb-2 rounded"
                />
              )}

              <p>{post.content}</p>
              <small className="mt-2 inline-block">{post.likes.length} Likes</small>
              <div className="btns">
                <button type="button" onClick={(e) => likehandler(e, post._id)}>{post.likes.includes(user?._id) ? "👎🏻" : "👍🏻"}</button>
                <Link to={`/edit/${post._id}`} className="mx-2">✏️</Link>


              </div>
            </div>
          )) : <p className="ml-5">No posts yet.</p>}
        </div>
      </div>
    </div>
  );
};

export default Profile;
