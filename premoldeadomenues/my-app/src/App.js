import './App.css';
import { Link } from 'react-router-dom';
import Login from './components/login';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <Login/>
        <p>APP</p>
        <Link
          className="App-link"
          to="/Menu"
        >
          Restaurants Menus
        </Link>
        <Link
          className="App-link"
          to="/pedidos"
        >
          Pedidos
        </Link>
      </header>
    </div>
  );
}

export default App;
