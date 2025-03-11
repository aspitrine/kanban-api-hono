import { Link } from 'react-router';

function Header() {
  return (
    <header>
      <div className="flex items-center justify-between p-4 bg-gray-800 text-white">
        <div className="flex items-center space-x-4">
          <Link to="/" className="font-bold">
            OKanban
          </Link>
        </div>
        <div className="flex items-center space-x-4">
          <Link to="/">Se connecter</Link>
          <Link to="/signup">Créer un compte</Link>
        </div>
      </div>
    </header>
  );
}

export default Header;
