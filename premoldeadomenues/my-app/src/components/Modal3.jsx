import React from 'react';
import './Modal3.css';

const Modal3 = ({ isOpen, onClose, children, title }) => {
  if (!isOpen) return null;

  return (
    <div className="modal3-overlay">
      <div className="modal3">
        <div className="modal3-header">
          <h2>{title}</h2>
          <button onClick={onClose} className="modal3-close-button">
            &times;
          </button>
        </div>
        <div className="modal3-content">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal3;
