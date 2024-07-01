// src/contexts/AppContext.js
import React, { createContext, useState, useEffect } from 'react';

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [menus, setMenus] = useState([]);
  const [categories, setCategories] = useState([]);

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

    const fetchCategories = async () => {
      try {
        const response = await fetch('http://localhost:5000/getCategories', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch categories');
        }

        const data = await response.json();
        setCategories(data);
      } catch (error) {
        console.error('Error fetching categories:', error.message);
      }
    };

    fetchMenus();
    fetchCategories();
  }, []);

  const addMenu = (menu) => {
    setMenus([...menus, menu]);
  };

  const updateMenu = (updatedMenu) => {
    setMenus(menus.map(menu => menu.menu_id === updatedMenu.menu_id ? updatedMenu : menu));
  };

  const deleteMenu = (menuId) => {
    setMenus(menus.filter(menu => menu.menu_id !== menuId));
  };

  const addCategory = (category) => {
    setCategories([...categories, category]);
  };

  const updateCategory = (updatedCategory) => {
    setCategories(categories.map(category => category.category_id === updatedCategory.category_id ? updatedCategory : category));
  };

  const deleteCategory = (categoryId) => {
    setCategories(categories.filter(category => category.category_id !== categoryId));
  };

  return (
    <AppContext.Provider value={{
      menus,
      addMenu,
      updateMenu,
      deleteMenu,
      categories,
      addCategory,
      updateCategory,
      deleteCategory
    }}>
      {children}
    </AppContext.Provider>
  );
};

