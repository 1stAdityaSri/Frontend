import React, { useContext, useEffect, useState } from 'react';
import { UserDataContext } from "../context/UserContext";
import axios from 'axios'
import { Link, useNavigate } from 'react-router-dom'



const Profile = () => {
  const { user, setuser } = useContext(UserDataContext);
  const [posts, setPosts] = useState([]);
  const navigate = useNavigate()

  const logouthandler = async () => {
    try {
      await axios.get("http://localhost:4000/users/logout", {
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
        "http://localhost:4000/users/upload", formData, { headers: { "Content-Type": "multipart/form-data" }, withCredentials: true });

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
        "http://localhost:4000/users/post",
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
        `http://localhost:4000/users/like/${postId}`,
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
          'http://localhost:4000/users/profile',
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
    <div className="bg-teal-600 w-full h-full p-4 flex flex-col">
      <div className="w-full flex justify-end">
        <button onClick={logouthandler} className="bg-black text-white px-4 py-2 rounded-2xl">
          Logout
        </button>
      </div>
      <div className="w-20 h-20 rounded-lg">

        <img className="w-full h-full object-cover" src={`http://localhost:4000/images/uploads/${user?.profilepic || "default.png"}`} alt="Profile" />



      </div>
      <form onSubmit={uploadhandler} className="my-4" encType="multipart/form-data">
        <input type="file" name="image" accept="image/*" required />
        <button type="submit" className="ml-2 bg-blue-500 text-white px-3 py-1 rounded">
          Change DP
        </button>
      </form>

      <h1>Welcome {user?.name}</h1>
      <h5>You can create a new post</h5>

      <form onSubmit={posthandler} encType="multipart/form-data" className="flex flex-col">

        <textarea className="border-gray-300 p-3 bg-gray-200" placeholder="write here" name="content" />
        <input type="file" name="image" accept="image/*" className="my-2" />
        <input className="mt-3 bg-yellow-500 rounded-md w-fit px-3 py-1" type="submit" value="Post" />
      </form>


      <div className="posts mt-10">
        <h3 className="text-gray-800 ml-5">Your posts</h3>
        <div className="postcontainer text-white">
          {posts.length > 0 ? posts.reverse().map((post) => (
            <div key={post._id} className="post bg-slate-800 shadow-2xl text-white rounded-md mx-3 p-3 my-3">
              <h4>@{user?.username}</h4>

              {post.image && (
                <img
                  src={`http://localhost:4000/images/uploads/${post.image}`}
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
