import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { UserDataContext } from '../context/UserContext';
import { Link, useNavigate } from 'react-router-dom'

const Feed = () => {

  const backgroundStyle = {
    backgroundImage: "url('https://4kwallpapers.com/images/walls/thumbs_3t/10307.jpg')",
    backgroundSize: "cover",
    backgroundPosition: "center",
    height: "100vh",
  };
  const [comment, setComment] = useState({});
  const [posts, setPosts] = useState([]);
  const { user } = useContext(UserDataContext);
  const [openComments, setOpenComments] = useState({});

  const navigate = useNavigate()
  const toggleComments = (postId) => {
    setOpenComments((prev) => ({
      ...prev,
      [postId]: !prev[postId], // toggle true/false
    }));
  };


  useEffect(() => {
    const fetchAllPosts = async () => {
      try {
        const res = await axios.get("http://localhost:4000/users/allposts", {
          withCredentials: true
        });
        // setuser(res.data.user)
        setPosts(res.data.posts);
      } catch (err) {
        console.error("Error fetching feed:", err);
      }
    };

    fetchAllPosts();
  }, []);


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
          post._id === postId ? {
            ...post, likes: post.likes.includes(user._id) ? post.likes.filter((id) => id !== user._id) // remove like
              : [...post.likes, user._id],
          } : post //add like
        )
      );
    } catch (err) {
      console.error("Like failed", err);
    }
  };

/////////////////////////////////////////////////////////////////////////////////////////////////
  const handleCommentChange = (postId, text) => {
    setComment(prev => ({ ...prev, [postId]: text }));
  };

  const handleCommentSubmit = async (e, postId) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        `http://localhost:4000/users/comment/${postId}`,
        { text: comment[postId] },
        { withCredentials: true }
      );

      const newComment = res.data.comment;
      setPosts(prev =>
        prev.map(post =>
          post._id === postId
            ? { ...post, comments: [...(post.comments || []), newComment] }
            : post
        )
      );
      setComment(prev => ({ ...prev, [postId]: '' }));
    } catch (err) {
      console.error("Comment failed", err);
    }
  };


////////////////////////////////////////////////////////////////////////////////////////////////////////////

const someoneprofile=async(e,postId)=>{
  e.preventDefault();
    const res = await axios.get(
        `http://localhost:4000/users/kisika/${postId}`,
        {  },
        { withCredentials: true }
      );
}

  useEffect(() => {
    if (user === null) {
      navigate("/login");
    }
  }, [user, navigate]);

  if (user === undefined) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen bg-gradient-to-r from-rose-400 to-orange-300">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-white"></div>
        <div className="text-white mt-4">Loading...</div>
      </div>
    );

  }


  return (

    <div className="  inset-0 p-4 bg-gradient-to-r from-rose-400 to-orange-300">
      <div className="userprofile flex justify-between">
        <h1 className="text-2xl font-bold mb-4 text-center">Instagram</h1>
        <h2 className="text-2xl font-bold mb-4 text-center">Explore Posts</h2>
        <Link to="/profile"><img
          src={`http://localhost:4000/images/uploads/${user?.profilepic || "default.png"}`}
          alt="User"
          className="w-10 h-10 rounded-full object-cover"
        />{user.name}</Link>
      </div>

      <div className="space-y-6">
        {posts.map((post) => (
          <div key={post._id} className="relative bg-rose-100 p-4 rounded-2xl shadow-2xl">
              <Link to="/kisika" onClick={(e)=>someoneprofile(e,post._id)}>
            <div className=" flex space-x-4 mb-2">
              <img
                src={`http://localhost:4000/images/uploads/${post.user?.profilepic || "default.png"}`}
                alt="User"
                className="w-10 h-10 rounded-full object-cover"
                />
              <span className="font-semibold pt-2">@{post.user?.username}</span>
            </div>
                </Link>
            {post.image && (
              <img
                src={`http://localhost:4000/images/uploads/${post.image}`}
                alt="Post"
                className="w-full mb-2 rounded"
              />
            )}
            <p className="text-gray-800">{post.content}</p>
            <div className="mt-2 text-sm text-gray-600">{post.likes.length} Likes</div>
            <button type="button" onClick={(e) => likehandler(e, post._id)}>{post.likes.includes(user?._id) ? "👎🏻" : "👍🏻"}</button>

            <button onClick={() => toggleComments(post._id)} className="ml-2">
              💬 Comment
            </button>


            {openComments[post._id] && (
              <div className="mt-2 space-y-1">
                {(post.comments || []).map((c, i) => (
                  <div key={i} className="text-sm text-gray-700">
                    <strong>@{c.user?.username || "Unknown"}:</strong> {c.text}
                  </div>
                ))}

                <form onSubmit={(e) => handleCommentSubmit(e, post._id)} className="flex mt-2">
                  <input
                    type="text"
                    value={comment[post._id] || ''}
                    onChange={(e) => handleCommentChange(post._id, e.target.value)}
                    placeholder="Add a comment..."
                    className="flex-1 p-1 rounded-l border"
                  />
                  <button type="submit" className="bg-blue-500 text-white px-2 rounded-r">Post</button>
                </form>
              </div>
            )}



          </div>

        ))}
      </div>
    </div>
  );
};

export default Feed;
