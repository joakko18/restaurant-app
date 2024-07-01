require('dotenv').config();
const express = require('express');
const router = express.Router();
const pool = require('../DB/database');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const authenticateToken = require('../index')

// Define the "Hello, World!" route
router.get('/', (req, res) => {
  res.send('Hello, World!');
});




//defining route to create users

router.post('/newuser',async(req,res)=>{
    try {
        const { username, email, password } = req.body;
    
        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);
    
        // Insert the new user into the database
        const newUser = await pool.query(
          'INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING *',
          [username, email, hashedPassword]
        );
    
        res.json(newUser.rows[0]);
      } catch (err) {
        console.error('Error adding user:', err.message);
        res.status(500).send('Server error');
      }
    });





    // Route to handle user login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  
  try {
    // Check if the user exists
    const user = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    
    if (user.rows.length === 0) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Check if the password is correct
    const validPassword = await bcrypt.compare(password, user.rows[0].password);
    
    if (!validPassword) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Generate a JWT token
    const token = jwt.sign({ user_id: user.rows[0].user_id }, process.env.JWT_SECRET, {
      expiresIn: '2h',
    });

    res.json({ token });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});





    // Route to create a new menu
    router.post('/menus', authenticateToken, async (req, res) => {
      try {
        const { name, description } = req.body;
        const user_id = req.user.user_id; // Get user ID from the validated token
    
        // Insert the new menu into the database
        const newMenu = await pool.query(
          'INSERT INTO menus (user_id, name, description) VALUES ($1, $2, $3) RETURNING *',
          [user_id, name, description]
        );
    
        res.json(newMenu.rows[0]);
      } catch (err) {
        console.error('Error creating menu:', err.message);
        res.status(500).send('Server error');
      }
    });




   // Route to get all menus for the logged-in user
router.post('/getMenus', authenticateToken, async (req, res) => {
  try {
    const user_id = req.user.user_id; // Get user ID from the validated token

    // Fetch menus from the database that belong to the user
    const menus = await pool.query('SELECT * FROM menus WHERE user_id = $1', [user_id]);

    res.json(menus.rows);
  } catch (err) {
    console.error('Error fetching menus:', err.message);
    res.status(500).send('Server error');
  }
});


    //route to update a menu
    router.put('/updateMenu', authenticateToken, async (req, res) => {
      try {
        const { menuId, name, description } = req.body;
    
        // Update the menu in the database
        const updatedMenu = await pool.query(
          'UPDATE menus SET name = $1, description = $2 WHERE menu_id = $3 RETURNING *',
          [name, description, menuId]
        );
    
        if (updatedMenu.rows.length === 0) {
          return res.status(404).json({ message: 'Menu not found' });
        }
    
        res.json(updatedMenu.rows[0]);
      } catch (err) {
        console.error('Error updating menu:', err.message);
        res.status(500).send('Server error');
      }
    });
    

    

// Route to create a new category for the logged-in user's menu

router.post('/categories', authenticateToken, async (req, res) => {
  try {
    const { menu_id, name } = req.body;
    const user_id = req.user.user_id; // Get user ID from the validated token

    // Check if the menu belongs to the logged-in user
    const menu = await pool.query('SELECT * FROM menus WHERE menu_id = $1 AND user_id = $2', [menu_id, user_id]);

    if (menu.rows.length === 0) {
      return res.status(401).json({ message: 'Menu does not belong to the logged-in user' });
    }

    // Insert the new category into the database
    const newCategory = await pool.query(
      'INSERT INTO categories (menu_id, name) VALUES ($1, $2) RETURNING *',
      [menu_id, name]
    );

    res.json(newCategory.rows[0]);
  } catch (err) {
    console.error('Error creating category:', err.message);
    res.status(500).send('Server error');
  }
});


// Route to get all categories for the logged-in user
router.get('/getCategories', authenticateToken, async (req, res) => {
  try {
    const user_id = req.user.user_id; // Get user ID from the validated token

    // Fetch categories from the database that belong to the user's menus
    const categories = await pool.query(
      'SELECT categories.* FROM categories INNER JOIN menus ON categories.menu_id = menus.menu_id WHERE menus.user_id = $1',
      [user_id]
    );

    res.json(categories.rows);
  } catch (err) {
    console.error('Error fetching categories:', err.message);
    res.status(500).send('Server error');
  }
});

  
// Route to update a category
router.put('/categories/:category_id', authenticateToken, async (req, res) => {
  try {
    const { category_id } = req.params;
    const { name } = req.body;
    const user_id = req.user.user_id; // Get user ID from the validated token

    // Check if the category belongs to a menu that belongs to the logged-in user
    const category = await pool.query(
      'SELECT categories.* FROM categories INNER JOIN menus ON categories.menu_id = menus.menu_id WHERE categories.category_id = $1 AND menus.user_id = $2',
      [category_id, user_id]
    );

    if (category.rows.length === 0) {
      return res.status(401).json({ message: 'Category does not belong to the logged-in user' });
    }

    // Update the category in the database
    const updatedCategory = await pool.query(
      'UPDATE categories SET name = $1 WHERE category_id = $2 RETURNING *',
      [name, category_id]
    );

    res.json(updatedCategory.rows[0]);
  } catch (err) {
    console.error('Error updating category:', err.message);
    res.status(500).send('Server error');
  }
});

  
  // Route to get all menus for the logged-in user, in form
router.post('/getMenus', authenticateToken, async (req, res) => {
  try {
    const user_id = req.user.user_id; // Get user ID from the validated token

    // Fetch menus from the database that belong to the user
    const menus = await pool.query('SELECT * FROM menus WHERE user_id = $1', [user_id]);

    res.json(menus.rows);
  } catch (err) {
    console.error('Error fetching menus:', err.message);
    res.status(500).send('Server error');
  }
});


//get menu by id
// Route to get all menus with their categories and items for the logged-in user
router.get('/getMenusWithDetails', authenticateToken, async (req, res) => {
  try {
    const user_id = req.user.user_id; // Get user ID from the validated token

    // Fetch menus from the database that belong to the user
    const menus = await pool.query('SELECT * FROM menus WHERE user_id = $1', [user_id]);

    const detailedMenus = await Promise.all(menus.rows.map(async menu => {
      const categories = await pool.query('SELECT * FROM categories WHERE menu_id = $1', [menu.menu_id]);
      const detailedCategories = await Promise.all(categories.rows.map(async category => {
        const items = await pool.query('SELECT * FROM items WHERE category_id = $1', [category.category_id]);
        return { ...category, items: items.rows };
      }));
      return { ...menu, categories: detailedCategories };
    }));

    res.json(detailedMenus);
  } catch (err) {
    console.error('Error fetching menu details:', err.message);
    res.status(500).send('Server error');
  }
});

  
  // Route to update a category by its ID
  router.put('/categories/:category_id', async (req, res) => {
    try {
      const { category_id } = req.params;
      const { name } = req.body;
  
      // Update the category in the database
      const updatedCategory = await pool.query(
        'UPDATE categories SET name = $1 WHERE category_id = $2 RETURNING *',
        [name, category_id]
      );
  
      res.json(updatedCategory.rows[0]);
    } catch (err) {
      console.error('Error updating category:', err.message);
      res.status(500).send('Server error');
    }
  });
  
  // Route to delete a category by its ID
  router.delete('/categories/:category_id', async (req, res) => {
    try {
      const { category_id } = req.params;
  
      // Delete the category from the database
      await pool.query('DELETE FROM categories WHERE category_id = $1', [
        category_id,
      ]);
  
      res.json({ message: 'Category deleted successfully' });
    } catch (err) {
      console.error('Error deleting category:', err.message);
      res.status(500).send('Server error');
    }
  });


//route to create a new item

// Route to create a new item
router.post('/items', authenticateToken, async (req, res) => {
  try {
    const { category_id, name, description, price } = req.body;
    const user_id = req.user.user_id; // Get user ID from the validated token

    // Check if the category belongs to a menu owned by the logged-in user
    const category = await pool.query(
      'SELECT categories.* FROM categories INNER JOIN menus ON categories.menu_id = menus.menu_id WHERE categories.category_id = $1 AND menus.user_id = $2',
      [category_id, user_id]
    );

    if (category.rows.length === 0) {
      return res.status(401).json({ message: 'Category does not belong to the logged-in user\'s menu' });
    }

    // Insert the new item into the database
    const newItem = await pool.query(
      'INSERT INTO items (category_id, name, description, price) VALUES ($1, $2, $3, $4) RETURNING *',
      [category_id, name, description, price]
    );

    res.json(newItem.rows[0]);
  } catch (err) {
    console.error('Error creating item:', err.message);
    res.status(500).send('Server error');
  }
});

  // Route to create a new item
router.post('/items', async (req, res) => {
    try {
      const { category_id, name, description, price } = req.body;
  
      // Insert the new item into the database
      const newItem = await pool.query(
        'INSERT INTO items (category_id, name, description, price) VALUES ($1, $2, $3, $4) RETURNING *',
        [category_id, name, description, price]
      );
  
      res.json(newItem.rows[0]);
    } catch (err) {
      console.error('Error creating item:', err.message);
      res.status(500).send('Server error');
    }
  });


  // Route to delete an item
router.delete('/items/:itemId', authenticateToken, async (req, res) => {
  try {
    const { itemId } = req.params;
    const user_id = req.user.user_id;

    // Verify the item belongs to the logged-in user by checking related menu and category
    const item = await pool.query(`
      SELECT i.* FROM items i
      JOIN categories c ON i.category_id = c.category_id
      JOIN menus m ON c.menu_id = m.menu_id
      WHERE i.item_id = $1 AND m.user_id = $2
    `, [itemId, user_id]);

    if (item.rows.length === 0) {
      return res.status(401).json({ message: 'Item does not belong to the logged-in user' });
    }

    // Delete the item from the database
    await pool.query('DELETE FROM items WHERE item_id = $1', [itemId]);

    res.json({ message: 'Item deleted successfully' });
  } catch (err) {
    console.error('Error deleting item:', err.message);
    res.status(500).send('Server error');
  }
});



// Route to update an item
router.put('/updateItem', authenticateToken, async (req, res) => {
  try {
    const { item_id, name, description } = req.body;
    const user_id = req.user.user_id; // Get user ID from the validated token

    // Check if the item belongs to the logged-in user by verifying its category and menu
    const item = await pool.query(
      'SELECT i.item_id FROM items i INNER JOIN categories c ON i.category_id = c.category_id INNER JOIN menus m ON c.menu_id = m.menu_id WHERE i.item_id = $1 AND m.user_id = $2',
      [item_id, user_id]
    );

    if (item.rows.length === 0) {
      return res.status(401).json({ message: 'Item does not belong to the logged-in user' });
    }

    // Update the item in the database
    const updatedItem = await pool.query(
      'UPDATE items SET name = $1, description = $2 WHERE item_id = $3 RETURNING *',
      [name, description, item_id]
    );

    res.json(updatedItem.rows[0]);
  } catch (err) {
    console.error('Error updating item:', err.message);
    res.status(500).send('Server error');
  }
});



//geting items from user
router.get('/getItems', authenticateToken, async (req, res) => {
  try {
    const user_id = req.user.user_id;

    // Fetch items from the database that belong to the user
    const items = await pool.query(`
      SELECT i.* FROM items i
      JOIN categories c ON i.category_id = c.category_id
      JOIN menus m ON c.menu_id = m.menu_id
      WHERE m.user_id = $1
    `, [user_id]);

    res.json(items.rows);
  } catch (err) {
    console.error('Error fetching items:', err.message);
    res.status(500).send('Server error');
  }
});

  
  // Route to get all items
  router.get('/items', async (req, res) => {
    try {
      // Fetch all items from the database
      const items = await pool.query('SELECT * FROM items');
      res.json(items.rows);
    } catch (err) {
      console.error('Error fetching items:', err.message);
      res.status(500).send('Server error');
    }
  });
  
  // Route to get an item by its ID
  router.get('/items/:item_id', async (req, res) => {
    try {
      const { item_id } = req.params;
  
      // Fetch the item from the database by its ID
      const item = await pool.query(
        'SELECT * FROM items WHERE item_id = $1',
        [item_id]
      );
  
      if (item.rows.length === 0) {
        return res.status(404).json({ message: 'Item not found' });
      }
  
      res.json(item.rows[0]);
    } catch (err) {
      console.error('Error fetching item:', err.message);
      res.status(500).send('Server error');
    }
  });
  //route to get all items by its category id

  router.get('/category/:category_id', async (req, res) => {
    try {
      const { category_id } = req.params;
  
      // Fetch the items from the database by their category ID
      const items = await pool.query(
        'SELECT * FROM items WHERE category_id = $1',
        [category_id]
      );
  
      if (items.rows.length === 0) {
        return res.status(404).json({ message: 'No items found for this category' });
      }
  
      res.json(items.rows); // Return all items
    } catch (err) {
      console.error('Error fetching items:', err.message);
      res.status(500).send('Server error');
    }
  });
  
  
  // Route to update an item by its ID
  router.put('/items/:item_id', async (req, res) => {
    try {
      const { item_id } = req.params;
      const { name, description, price } = req.body;
  
      // Update the item in the database
      const updatedItem = await pool.query(
        'UPDATE items SET name = $1, description = $2, price = $3 WHERE item_id = $4 RETURNING *',
        [name, description, price, item_id]
      );
  
      res.json(updatedItem.rows[0]);
    } catch (err) {
      console.error('Error updating item:', err.message);
      res.status(500).send('Server error');
    }
  });
  
  // Route to delete an item by its ID
  router.delete('/items/:item_id', async (req, res) => {
    try {
      const { item_id } = req.params;
  
      // Delete the item from the database
      await pool.query('DELETE FROM items WHERE item_id = $1', [item_id]);
  
      res.json({ message: 'Item deleted successfully' });
    } catch (err) {
      console.error('Error deleting item:', err.message);
      res.status(500).send('Server error');
    }
  });
  
module.exports = router;
