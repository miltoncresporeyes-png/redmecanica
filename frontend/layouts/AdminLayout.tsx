
import React from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';

const AdminLayout: React.FC<{ onLogout: () => void }> = ({ onLogout }) => {
  const navigate = useNavigate();

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 text-white flex flex-col">
        <div className="p-4 border-b border-gray-800">
          <h1 className="text-xl font-bold bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent">
            Panel Admin
          </h1>
        </div>
        
        <nav className="flex-1 p-4 space-y-2">
          <Link to="/admin" className="block px-4 py-2 rounded hover:bg-gray-800 transition">
            Dashboard
          </Link>
          <Link to="/admin/users" className="block px-4 py-2 rounded hover:bg-gray-800 transition">
            Usuarios
          </Link>
          <Link to="/admin/providers" className="block px-4 py-2 rounded hover:bg-gray-800 transition">
            Prestadores
          </Link>
          <Link to="/admin/stats" className="block px-4 py-2 rounded hover:bg-gray-800 transition">
            Reportes
          </Link>
        </nav>

        <div className="p-4 border-t border-gray-800">
          <button 
            onClick={() => {
              onLogout();
              navigate('/');
            }}
            className="w-full px-4 py-2 bg-red-600 hover:bg-red-700 rounded text-center transition"
          >
            Cerrar Sesión
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <header className="bg-white shadow p-4">
          <div className="flex justify-between items-center">
            <h2 className="text-gray-600">Bienvenido, Administrador</h2>
            <Link to="/" className="text-sm text-blue-600 hover:underline">
              Ir al Sitio Principal
            </Link>
          </div>
        </header>
        <div className="p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
