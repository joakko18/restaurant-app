import React, { useState } from 'react';
import './DropDownButton.css';

const DropdownButton = ({ openModal, openModal2, openModal3 }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="dropdown">
      <button onClick={toggleDropdown} className="dropdown-toggle">
        Menu Options
      </button>
      {isOpen && (
        <div className="dropdown-menu">
          <button onClick={openModal} className="dropdown-item">
            Manage Menus
          </button>
          <button onClick={openModal2} className="dropdown-item">
            Manage Categories
          </button>
          <button onClick={openModal3} className="dropdown-item">
            Manage Items
          </button>
        </div>
      )}
    </div>
  );
};

export default DropdownButton;

