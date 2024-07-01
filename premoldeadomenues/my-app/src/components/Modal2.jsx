import React from 'react';
import './Modal2.css';

const Modal2 = ({ isOpen, onClose, children, title }) => {
  if (!isOpen) return null;

  return (
    <div className="modal2-overlay">
      <div className="modal2">
        <div className="modal2-header">
          <h2>{title}</h2>
          <button onClick={onClose} className="modal2-close-button">
            &times;
          </button>
        </div>
        <div className="modal2-content">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal2;
