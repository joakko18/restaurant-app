
// src/pages/MenuPage.js
import React, { useContext, useState } from 'react';
import { AppContext } from '../context/appcontext';
import CreateMenuForm from '../components/CreateMenu';
import UpdateMenuForm from '../components/UpdateMenu';
import DisplayMenus from '../components/Menus';
import CreateCategoryForm from '../components/CreateCategories';
import UpdateCategoryForm from '../components/UpdateCategory';
import CreateItemForm from '../components/CreateItem';
import DropdownButton from '../components/DropDownButton';
import './Menu.css';
import Modal from '../components/Modal';
import Modal2 from '../components/Modal2';
import Modal3 from '../components/Modal3';


const Menues = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModal2Open, setIsModal2Open] = useState(false);
  const [isModal3Open, setIsModal3Open] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const openModal2 = () => setIsModal2Open(true);
  const closeModal2 = () => setIsModal2Open(false);

  const openModal3 = () => setIsModal3Open(true);
  const closeModal3 = () => setIsModal3Open(false);

  return (
    <div className='menues'>
     <DropdownButton 
        openModal={openModal}
        openModal2={openModal2}
        openModal3={openModal3}
      />
      <Modal isOpen={isModalOpen} onClose={closeModal} title="Manage Menus">
        <CreateMenuForm />
        <UpdateMenuForm />
      </Modal>
      <Modal2 isOpen={isModal2Open} onClose={closeModal2} title="Manage Categories">
        <CreateCategoryForm />
        <UpdateCategoryForm/>
      </Modal2>
      <Modal3 isOpen={isModal3Open} onClose={closeModal3} title="Manage Items">
        <CreateItemForm />
      </Modal3>
      
      
      
      <DisplayMenus/>
      <h1>Menu Page</h1>
      
    </div>
  );
};

export default Menues;

