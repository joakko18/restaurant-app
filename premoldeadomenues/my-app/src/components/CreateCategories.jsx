import React, { useState, useEffect } from 'react';
import './CreateCategoryForm.css';
const CreateCategoryForm = () => {
  const [menus, setMenus] = useState([]);
  const [selectedMenuId, setSelectedMenuId] = useState('');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    const fetchMenus = async () => {
      try {
        const response = await fetch('http://localhost:5000/getMenus', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch menus');
        }

        const data = await response.json();
        setMenus(data);
      } catch (error) {
        console.error('Error fetching menus:', error.message);
      }
    };

    fetchMenus();
  }, []);

  const handleMenuChange = (e) => {
    const menuId = e.target.value;
    setSelectedMenuId(menuId);

    const selectedMenu = menus.find(menu => menu.menu_id === parseInt(menuId));
    if (selectedMenu) {
      setName(selectedMenu.name);
      setDescription(selectedMenu.description);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:5000/categories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ menu_id: selectedMenuId, name }),
      });

      if (!response.ok) {
        throw new Error('Failed to create category');
      }

      // Handle successful creation
      const data = await response.json();
      console.log('Category created:', data);
    } catch (error) {
      // Handle error
      console.error('Error creating category:', error.message);
    }
  };

  return (
    <div className="category-form">
      <h2>Create a Category</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="menu">Select Menu:</label>
          <select id="menu" value={selectedMenuId} onChange={handleMenuChange} required>
            <option value="">Select a menu</option>
            {menus.map((menu) => (
              <option key={menu.menu_id} value={menu.menu_id}>
                {menu.name}
              </option>
            ))}
          </select>
        </div>
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
        <button type="submit">Create Category</button>
      </form>
    </div>
  );
};

export default CreateCategoryForm;
