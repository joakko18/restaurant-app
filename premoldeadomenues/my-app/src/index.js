import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import Menu from './pages/Menu';
import Commands from './pages/pedidos';
import Layout from './components/Layout';

import { AppProvider } from './context/appcontext'

import { createBrowserRouter,RouterProvider } from 'react-router-dom';

const router = createBrowserRouter([
  {path:"/",element:<Layout><App/></Layout>},
  {path:"/Menu",element:<Layout><Menu/></Layout>},
  {path:"/Pedidos",element:<Layout><Commands/></Layout>},
]);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  
    <AppProvider>
      <RouterProvider router={router} />
    </AppProvider>
  
);
