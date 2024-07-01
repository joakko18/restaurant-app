import React from 'react';

const DeleteItemButton = ({ itemId, onItemDeleted }) => {
  const handleDelete = async () => {
    try {
      const response = await fetch(`http://localhost:5000/items/${itemId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete item');
      }

      // Notify the parent component about the deletion
      onItemDeleted(itemId);
    } catch (error) {
      console.error('Error deleting item:', error.message);
    }
  };

  return (
    <button onClick={handleDelete}>
      Delete Item
    </button>
  );
};

export default DeleteItemButton;
