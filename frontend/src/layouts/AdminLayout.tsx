
import React, { useState } from 'react';
import { Link, useLocation, Outlet, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  Wrench, 
  ShieldAlert, 
  Activity, 
  Menu, 
  X,
  Bell,
  Search,
  LogOut,
  ExternalLink
} from 'lucide-react';
import { useAuth } from '../app/providers';
import { motion, AnimatePresence } from 'framer-motion';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const navItems = [
  { label: 'Panel Principal', icon: LayoutDashboard, path: '/admin' },
  { label: 'Prestadores', icon: Users, path: '/admin/providers' },
  { label: 'Servicios/Jobs', icon: Wrench, path: '/admin/jobs' },
  { label: 'Auditoría', icon: ShieldAlert, path: '/admin/audit' },
  { label: 'Monitoreo', icon: Activity, path: '/admin/monitoring' },
];

const AdminLayout: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const location = useLocation();
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex font-sans">
      {/* Sidebar */}
      <aside 
        className={cn(
          "bg-[#0F172A] text-white transition-all duration-300 ease-in-out fixed inset-y-0 z-50",
          isSidebarOpen ? "w-64" : "w-20"
        )}
      >
        <div className="p-6 flex items-center justify-between border-b border-gray-800">
          <div className={cn("overflow-hidden transition-all duration-300 whitespace-nowrap", isSidebarOpen ? "w-auto opacity-100" : "w-0 opacity-0")}>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
              RedMecánica
            </span>
          </div>
          <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-1 hover:bg-gray-800 rounded-lg transition-colors">
            {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        <nav className="p-4 space-y-2 mt-4">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path || (item.path === '/admin' && location.pathname === '/admin/');
            const Icon = item.icon;
            
            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex items-center p-3 rounded-xl transition-all duration-200 group relative",
                  isActive 
                    ? "bg-blue-600/10 text-blue-400 shadow-[inset_0_0_0_1px_rgba(59,130,246,0.1)]" 
                    : "text-gray-400 hover:bg-gray-800 hover:text-white"
                )}
              >
                <Icon size={20} className={cn("shrink-0", isActive && "text-blue-400")} />
                <span className={cn(
                  "ml-3 transition-all duration-300 overflow-hidden whitespace-nowrap font-medium",
                  isSidebarOpen ? "w-auto opacity-100" : "w-0 opacity-0"
                )}>
                  {item.label}
                </span>
                {!isSidebarOpen && (
                  <div className="absolute left-full ml-4 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all whitespace-nowrap z-50 shadow-xl border border-gray-800">
                    {item.label}
                  </div>
                )}
                {isActive && isSidebarOpen && (
                  <motion.div 
                    layoutId="active-pill"
                    className="absolute right-2 w-1.5 h-1.5 bg-blue-400 rounded-full"
                  />
                )}
              </Link>
            );
          })}
        </nav>

        <div className="absolute bottom-6 left-4 right-4 space-y-2">
           <Link to="/" className="w-full flex items-center p-3 text-gray-400 hover:bg-gray-800 hover:text-white rounded-xl transition-all duration-200 group">
             <ExternalLink size={20} />
             <span className={cn(
                "ml-3 transition-all duration-300 whitespace-nowrap overflow-hidden",
                isSidebarOpen ? "w-auto opacity-100" : "w-0 opacity-0"
             )}>Ir al Sitio</span>
           </Link>
           <button 
             onClick={() => { logout(); navigate('/'); }}
             className="w-full flex items-center p-3 text-gray-400 hover:bg-red-500/10 hover:text-red-400 rounded-xl transition-all duration-200 group"
           >
             <LogOut size={20} />
             <span className={cn(
                "ml-3 transition-all duration-300 whitespace-nowrap overflow-hidden",
                isSidebarOpen ? "w-auto opacity-100" : "w-0 opacity-0"
             )}>Salir</span>
           </button>
        </div>
      </aside>

      {/* Main Content */}
      <main 
        className={cn(
          "flex-1 transition-all duration-300 min-h-screen flex flex-col",
          isSidebarOpen ? "ml-64" : "ml-20"
        )}
      >
        {/* Header */}
        <header className="h-20 bg-white/80 backdrop-blur-md border-b border-gray-100 sticky top-0 z-40 px-8 flex items-center justify-between">
          <div className="flex items-center gap-4 bg-gray-50 px-4 py-2 rounded-xl border border-gray-100 min-w-[300px]">
            <Search size={18} className="text-gray-400" />
            <input 
              type="text" 
              placeholder="Buscar rastro digital..." 
              className="bg-transparent border-none focus:outline-none text-sm w-full font-medium"
            />
          </div>

          <div className="flex items-center gap-6">
            <button className="relative p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-all">
              <Bell size={20} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            <div className="h-8 w-[1px] bg-gray-200"></div>
            <div className="flex items-center gap-3 bg-gray-50 pr-4 pl-1 py-1 rounded-full border border-gray-100 border-dashed">
              <div className="w-8 h-8 rounded-full bg-linear-to-tr from-blue-600 to-indigo-600 flex items-center justify-center font-bold text-white text-xs shadow-lg">
                {user?.email?.substring(0,2).toUpperCase() || 'AD'}
              </div>
              <div className="text-left">
                <p className="text-xs font-bold text-gray-900 leading-none">{user?.name || 'Admin Central'}</p>
                <p className="text-[9px] text-gray-400 font-bold tracking-widest uppercase mt-0.5">{user?.role || 'SUPER ADMIN'}</p>
              </div>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="p-8 max-w-[1600px] w-full mx-auto flex-1">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
