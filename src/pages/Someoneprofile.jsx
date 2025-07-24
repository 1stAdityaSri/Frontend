import React, { useEffect, useContext, useState } from 'react';
import { useParams } from 'react-router-dom';
import { UserDataContext } from "../context/UserContext";

import axios from 'axios';

const Someoneprofile = () => {
  const { id } = useParams(); // This is the user's ID from URL
  const { user, setuser } = useContext(UserDataContext);

  const [profile, setProfile] = useState(null);
  const [userPosts, setUserPosts] = useState([]);


  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get(`http://localhost:4000/users/someoneprofile/${id}`, {
          withCredentials: true,
        });
        setProfile(res.data.user);
        setUserPosts(res.data.posts);
      } catch (err) {
        console.error("Error fetching user profile", err);
      }
    };

    fetchProfile();
  }, [id]);



  if (!profile) {
    return (
      <div className="text-center mt-10 text-white">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-white mx-auto mb-4"></div>
        Loading profile...
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="flex items-center space-x-4 mb-6">
      <div>
        <img className="w-20 h-20 object-cover" src={`http://localhost:4000/images/uploads/${profile?.profilepic || "default.png"}`} alt="Profile" />
        <h2 className="text-xl font-bold">@{profile.username}</h2>
      </div>
        <div className='flex flex-row font-bold' >
          <h1 className=" mt-5 ml-20">Followers</h1>
          <h1 className="  mt-5 ml-5">{profile.followers.length}</h1>
          <h1 className="mt-5 ml-20">Following</h1>
          <h1 className=" mt-5 ml-5 ">{profile.following.length}</h1>

        </div>
      </div>

      {userPosts.length > 0 ? (
        <div className="mt-6 space-y-4">
          <h3 className="text-xl font-semibold">Posts by @{profile.username}</h3>
          {userPosts.map((post) => (
            <div key={post._id} className="bg-white rounded-xl shadow p-4">
              {post.image && (
                <img
                  src={`http://localhost:4000/images/uploads/${post.image}`}
                  alt="Post"
                  className="w-full mb-2 rounded"
                />
              )}
              <p className="text-gray-800">{post.content}</p>
              <p className="text-sm text-gray-600">{post.likes.length} likes</p>
            </div>
          ))}
        </div>
      ) : (
        <p className="mt-6 text-gray-500">No posts yet.</p>
      )}
    </div>
  );


};

export default Someoneprofile;
