import React, { useState, useEffect } from 'react';
import './Menus.css';
import DeleteItemButton from './DeleteItem';
import UpdateItemForm from './UpdateItem';

const DisplayMenusWithDetails = () => {
  const [menus, setMenus] = useState([]);
  const [editingItemId, setEditingItemId] = useState(null);

  useEffect(() => {
    const fetchMenus = async () => {
      try {
        const response = await fetch('http://localhost:5000/getMenusWithDetails', {
          method: 'GET',
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

  const handleItemDeleted = (itemId) => {
    setMenus((prevMenus) =>
      prevMenus.map((menu) => ({
        ...menu,
        categories: menu.categories.map((category) => ({
          ...category,
          items: category.items.filter((item) => item.item_id !== itemId),
        })),
      }))
    );
  };

  const handleItemUpdated = (updatedItem) => {
    setMenus((prevMenus) =>
      prevMenus.map((menu) => ({
        ...menu,
        categories: menu.categories.map((category) => ({
          ...category,
          items: category.items.map((item) =>
            item.item_id === updatedItem.item_id ? updatedItem : item
          ),
        })),
      }))
    );
    setEditingItemId(null);
  };

  const startEditingItem = (item) => {
    setEditingItemId(item.item_id);
  };

  const cancelEditing = () => {
    setEditingItemId(null);
  };

  return (
    <div className="menus-list">
      <h2>Your Menus</h2>
      {menus.length === 0 ? (
        <p>No menus available.</p>
      ) : (
        menus.map((menu) => (
          <div key={menu.menu_id} className="menu-item">
            <h3>{menu.name}</h3>
            <p><strong>ID:</strong> {menu.menu_id}</p>
            <p>{menu.description}</p>
            {menu.categories.length === 0 ? (
              <p>No categories available.</p>
            ) : (
              menu.categories.map((category) => (
                <div key={category.category_id} className="category-item">
                  <h4>Category: {category.name}</h4>
                  {category.items.length === 0 ? (
                    <p>No items available.</p>
                  ) : (
                    category.items.map((item) => (
                      <div key={item.item_id} className="item">
                        {editingItemId === item.item_id ? (
                          <UpdateItemForm
                            itemId={item.item_id}
                            initialName={item.name}
                            initialDescription={item.description}
                            onItemUpdated={handleItemUpdated}
                            onCancel={cancelEditing}
                          />
                        ) : (
                          <>
                            <p><strong>ID:</strong> {item.item_id}</p>
                            <p><strong>Item:</strong> {item.name}</p>
                            <p>{item.description}</p>
                            <button onClick={() => startEditingItem(item)}>Update Item</button>
                            <DeleteItemButton itemId={item.item_id} onItemDeleted={handleItemDeleted} />
                          </>
                        )}
                      </div>
                    ))
                  )}
                </div>
              ))
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default DisplayMenusWithDetails;
