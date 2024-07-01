import React, { useState, useEffect } from 'react';
import './createMenuForm.css'

const CreateMenuForm = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [user_id, setUserId] = useState('');

  useEffect(() => {
    // Decode JWT token to get user ID when component mounts
    const token = localStorage.getItem('token');
    if (token) {
      const decodedToken = decodeToken(token);
      setUserId(decodedToken.user_id);
    }
  }, []); // Run once when the component mounts

  const decodeToken = (token) => {
    try {
      const decoded = JSON.parse(atob(token.split('.')[1]));
      return decoded;
    } catch (error) {
      console.error('Error decoding token:', error);
      return null;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Send POST request to create a new menu
      const response = await fetch('http://localhost:5000/menus', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ user_id, name, description })
      });

      if (!response.ok) {
        throw new Error('Failed to create menu');
      }

      // Handle successful creation
      const data = await response.json();
      console.log('Menu created:', data);
    } catch (error) {
      // Handle error
      console.error('Error creating menu:', error.message);
    }
  };

  return (
    <div className="menu-form">
      <h2>Create a Menu</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Name:</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="description">Description:</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          ></textarea>
        </div>
        <button type="submit">Create Menu</button>
      </form>
    </div>
  );
};

export default CreateMenuForm;
