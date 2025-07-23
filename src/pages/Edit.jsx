import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Edit = () => {
  const { id } = useParams(); // get post id from URL
  const navigate = useNavigate();
  const [content, setContent] = useState('');
    const [image, setImage] = useState('');
        const [post, setPost] = useState('');



  // fetch the post content
  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await axios.get(`http://localhost:4000/users/edit/${id}`, {
          withCredentials: true
        });
        setContent(res.data.post.content);
        setImage(res.data.post.image);
        setPost(res.data.post);
      } catch (err) {
        console.error('Failed to fetch post:', err);
      }
    };

    fetchPost();
  }, [id]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await axios.put(
        `http://localhost:4000/users/update/${id}`,
        { content },
        {image},
        { withCredentials: true }
      );
      navigate('/profile');
    } catch (err) {
      console.error('Update failed:', err);
    }
  };

    const deletehandler = async () => {
  const confirmDelete = window.confirm("Are you sure you want to delete this post?");
  if (!confirmDelete) return;

  try {
    await axios.delete(`http://localhost:4000/users/delete/${id}`, {
      withCredentials: true
    });

    navigate('/profile');
  } catch (err) {
    console.error("Delete failed:", err);
  }
};


  

  return (
    <div className="w-full h-screen flex flex-col bg-pink-200">
      <div className="flex w-full justify-end">
        <a href="/logout" className="bg-black w-20 text-pink-900 px-2 m-5 py-1 rounded-2xl inline-block">Logout</a>
      </div>
      <h2 className="text-xl font-bold text-center">Edit your post</h2>
      <form onSubmit={handleUpdate} className="flex flex-col p-6 max-w-lg mx-auto w-full space-y-4">
           {post.image && (
              <img
                src={`http://localhost:4000/images/uploads/${post.image}`}
                alt="Post"
                className="w-full mb-2 rounded"
              />
            )}
        <textarea
          className="border border-black p-4 rounded-md bg-gradient-to-br from-pink-100 to-pink-400 text-black"
          name="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={6}
        />
        <input
          className="mt-3 bg-yellow-500 w-fit px-4 py-2 rounded-md cursor-pointer"
          type="submit"
          value="Update Post"
        />
      <input onClick={deletehandler} className="mt-3 bg-yellow-500 w-fit px-4 py-2 rounded-md cursor-pointer"
          type="button"
          value="Delete post"
          />
          </form>
    </div>
  );
};

export default Edit;
