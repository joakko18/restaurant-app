import React, { useState, useEffect } from 'react';

const UpdateMenuForm = () => {
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
      const response = await fetch('http://localhost:5000/updateMenu', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ menuId: selectedMenuId, name, description })
      });

      if (!response.ok) {
        throw new Error('Failed to update menu');
      }

      // Handle successful update
      const data = await response.json();
      console.log('Menu updated:', data);
    } catch (error) {
      // Handle error
      console.error('Error updating menu:', error.message);
    }
  };

  return (
    <div className="menu-form">
      <h2>Update Menu</h2>
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
        <div className="form-group">
          <label htmlFor="description">Description:</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          ></textarea>
        </div>
        <button type="submit">Update Menu</button>
      </form>
    </div>
  );
};

export default UpdateMenuForm;
