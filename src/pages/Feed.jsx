import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { UserDataContext } from '../context/UserContext';
import { Link, useNavigate } from 'react-router-dom'
import "@copilotkit/react-ui/styles.css";
import { CopilotPopup } from "@copilotkit/react-ui";

const Feed = () => {

  const backgroundStyle = {
    backgroundImage: "url('https://4kwallpapers.com/images/walls/thumbs_3t/10307.jpg')",
    backgroundSize: "cover",
    backgroundPosition: "center",
    height: "100vh",
  };
  const [isFollowing, setIsFollowing] = useState(false);
  const [followingState, setFollowingState] = useState({});

  const [comment, setComment] = useState({});
  const [posts, setPosts] = useState([]);
  const { user, loading } = useContext(UserDataContext);

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
        const res = await axios.get(`${process.env.REACT_APP_URL}/users/allposts`, {
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

  useEffect(() => {
    if (user && posts.length > 0) {
      const initialState = {};
      posts.forEach((post) => {
        if (post.user && post.user._id) { // ✅ SAFETY
          const targetUserId = post.user._id;
          initialState[targetUserId] = user.following.includes(targetUserId);
        }
      });
      setFollowingState(initialState);
    }
  }, [user, posts]);


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
        `${process.env.REACT_APP_URL}/users/comment/${postId}`,
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




  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  const followHandler = async (e, userId) => {
    e.preventDefault();

    try {
      const res = await axios.post(
        `${process.env.REACT_APP_URL}/users/follow/${userId}`,
        {},
        { withCredentials: true }
      );

      setFollowingState(prev => ({
        ...prev,
        [userId]: res.data.isFollowing,
      }));
    } catch (err) {
      console.error("Follow failed", err);
    }
  };


  ////////////////////////////////////////////////////////////////////////////////////////////////////////////


  useEffect(() => {
    if (!loading && user === null) {
      navigate("/login");
    }
  }, [loading, user, navigate]);



  if (loading || user === undefined) {
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-r from-rose-400 to-orange-300">
        <div className="text-white text-lg">Loading user...</div>
      </div>
    );
  }





  return (

    <div className="  inset-0 p-4 bg-gradient-to-r from-rose-400 to-orange-300">
      <div className="userprofile flex justify-between">
        <h1 className="text-2xl font-bold mb-4 text-center">Instagram</h1>
        <h2 className="text-2xl font-bold mb-4 text-center">Explore Posts</h2>
        <Link to="/profile">
          <img
            src={`http://localhost:4000/images/uploads/${user?.profilepic || "default.png"}`}
            alt="User"
            className="profilepic rounded-full object-cover" 
          />
          {user?.name || "Loading..."}
        </Link>
      </div>

      <div className="space-y-6">
        {posts.map((post) => (
          <div key={post._id} className="relative bg-rose-100 p-4 rounded-2xl shadow-2xl">

            {post.user && post.user._id && (
              <div className="flex justify-between">

                <Link className="flex mb-3" to={`/someoneprofile/${post.user._id}`}>

                  <img
                    src={`http://localhost:4000/images/uploads/${post.user.profilepic || "default.png"}`}
                    alt="User"
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <span className="font-semibold pt-2">@{post.user.username}</span>

                </Link>
                {post.user && post.user._id && post.user._id !== user._id && (
                  <button
                    onClick={(e) => followHandler(e, post.user._id)}
                    className="bg-black h-min px-2 rounded-md mr-5 mt-1 text-white"
                  >
                    {followingState[post.user._id] ? "Unfollow" : "Follow"}
                  </button>
                )}



              </div>
            )}


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
      <CopilotPopup
        instructions={"You are assisting the user as best as you can. Answer in the best way possible given the data you have."}
        labels={{
          title: "Popup Assistant",
          initial: "Need any help?",
        }}
      />
    </div>
  );
};

export default Feed;
