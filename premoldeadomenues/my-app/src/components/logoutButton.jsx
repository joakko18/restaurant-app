import React from 'react';
import { useNavigate } from 'react-router-dom';

const LogoutButton = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token'); // Remove the token from local storage
    localStorage.removeItem('user_id'); // Optionally remove the user_id if stored
    navigate('/'); // Redirect to the home page or login page
    alert('Logged Out')
  };

  return <button onClick={handleLogout}>Logout</button>;
};

export default LogoutButton;
