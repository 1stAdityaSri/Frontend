import React, { createContext, useEffect, useState } from 'react';
import axios from 'axios';

export const UserDataContext = createContext();

const UserContext = ({ children }) => {
  const [user, setuser] = useState(undefined); // undefined = loading
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Try to get the current logged-in user
    axios.get("http://localhost:4000/users/profile", { withCredentials: true })
      .then((res) => {
        setuser(res.data.user); // success
      })
      .catch((err) => {
        console.log("Not logged in", err);
        setuser(null); // not logged in
      })
      .finally(() => setLoading(false)); // done loading
  }, []);

  return (
    <UserDataContext.Provider value={{ user, setuser, loading }}>
      {children}
    </UserDataContext.Provider>
  );
};

export default UserContext;
