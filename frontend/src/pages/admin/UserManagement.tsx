import React, { useEffect, useState } from 'react';
import api from '../../lib/http';
import { 
  Search, 
  Filter, 
  Download, 
  MoreVertical, 
  Mail, 
  Shield, 
  Clock,
  UserCheck,
  UserX,
  RefreshCw,
  AlertTriangle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  status?: string;
  createdAt: string;
  _count?: {
    serviceRequests: number;
  };
}

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL');
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await api.get('/admin/users');
      setUsers(response.data);
    } catch (error) {
      console.error("Error fetching users", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleToggleSuspend = async (user: User) => {
    const isSuspended = user.status === 'SUSPENDED';
    const actionText = isSuspended ? 'reactivar' : 'suspender';
    if (!confirm(`¿Estás seguro de que deseas ${actionText} la cuenta de "${user.name || user.email}"?`)) {
      return;
    }

    setActionLoading(user.id);
    try {
      const endpoint = isSuspended 
        ? `/admin/users/${user.id}/reactivate` 
        : `/admin/users/${user.id}/suspend`;
      await api.post(endpoint);
      setUsers(prev => prev.map(u => {
        if (u.id === user.id) {
          return { ...u, status: isSuspended ? 'ACTIVE' : 'SUSPENDED' };
        }
        return u;
      }));
    } catch (err: any) {
      alert(err.response?.data?.error || `Error al ${actionText} usuario`);
    } finally {
      setActionLoading(null);
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      (user.name?.toLowerCase().includes(searchTerm.toLowerCase()) || '') ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'ALL' || user.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  return (
    <div className="space-y-8 pb-12 font-sans">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Gestión de Usuarios</h1>
          <p className="text-gray-500 mt-1">Control de acceso, suspensión y perfiles de la plataforma.</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={fetchUsers}
            className="p-3 bg-white border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 transition-all shadow-sm cursor-pointer"
            title="Actualizar lista"
          >
            <RefreshCw size={20} className={loading ? "animate-spin" : ""} />
          </button>
        </div>
      </div>

      <div className="bg-white p-4 rounded-[24px] shadow-sm border border-gray-100 flex flex-col md:flex-row gap-4 items-center">
        <div className="flex-1 flex items-center gap-3 bg-gray-50 px-4 py-2.5 rounded-xl border border-gray-100 w-full font-medium">
          <Search size={18} className="text-gray-400" />
          <input 
            type="text" 
            placeholder="Buscar por nombre o email..." 
            className="bg-transparent border-none focus:outline-none text-sm w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-3 py-2 text-sm font-bold text-gray-700">
            <Filter size={16} className="text-gray-400" />
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="bg-transparent border-none focus:outline-none text-xs font-bold cursor-pointer"
            >
              <option value="ALL">Todos los roles</option>
              <option value="USER">Usuarios</option>
              <option value="MECHANIC">Prestadores</option>
              <option value="ADMIN">Administradores</option>
            </select>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-[32px] shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50">
                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Usuario</th>
                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Rol</th>
                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Estado</th>
                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Actividad</th>
                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Registro</th>
                <th className="px-8 py-5 text-center text-[10px] font-black text-gray-400 uppercase tracking-widest">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              <AnimatePresence mode="popLayout">
                {filteredUsers.map((user, index) => {
                  const isSuspended = user.status === 'SUSPENDED';
                  const isDeleted = user.status === 'DELETED';
                  const isBusy = actionLoading === user.id;

                  return (
                    <motion.tr 
                      key={user.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.03 }}
                      className={`group hover:bg-gray-50/50 transition-all ${isSuspended ? 'bg-red-50/20' : ''}`}
                    >
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-4">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm shadow-inner group-hover:scale-110 transition-transform ${
                            isSuspended 
                              ? 'bg-red-100 text-red-600' 
                              : isDeleted
                              ? 'bg-slate-200 text-slate-500'
                              : 'bg-gradient-to-br from-blue-100 to-indigo-100 text-blue-600'
                          }`}>
                            {user.name?.charAt(0) || user.email.charAt(0).toUpperCase()}
                          </div>
                          <div className="space-y-0.5">
                            <p className="text-sm font-black text-gray-900 leading-none">
                              {user.name || 'Usuario Anónimo'}
                            </p>
                            <div className="flex items-center gap-1.5 text-[11px] text-gray-400 font-medium">
                              <Mail size={10} />
                              {user.email}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <span className={cn(
                          "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider flex items-center gap-1.5 w-fit shadow-xs",
                          user.role === 'ADMIN' ? 'bg-purple-100 text-purple-700' : 
                          user.role === 'MECHANIC' ? 'bg-orange-100 text-orange-700' : 'bg-blue-50 text-blue-700'
                        )}>
                          <Shield size={10} />
                          {user.role}
                        </span>
                      </td>
                      <td className="px-8 py-6">
                        <span className={cn(
                          "px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider flex items-center gap-1 w-fit",
                          isSuspended ? 'bg-red-100 text-red-700' :
                          isDeleted ? 'bg-slate-100 text-slate-600' :
                          'bg-emerald-50 text-emerald-700'
                        )}>
                          {isSuspended ? '🚫 Suspendido' : isDeleted ? '⚪ Baja' : '✓ Activo'}
                        </span>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex flex-col">
                          <span className="text-sm font-bold text-gray-700 tracking-tight">{user._count?.serviceRequests || 0}</span>
                          <span className="text-[10px] text-gray-400 font-bold uppercase">Solicitudes</span>
                        </div>
                      </td>
                      <td className="px-8 py-6 text-sm text-gray-500 font-bold tracking-tight">
                         <div className="flex items-center gap-2">
                           <Clock size={14} className="text-gray-300" />
                           {new Date(user.createdAt).toLocaleDateString('es-CL', { day: '2-digit', month: 'short', year: 'numeric' })}
                         </div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex items-center justify-center gap-2">
                          {!isDeleted && (
                            <button 
                              onClick={() => handleToggleSuspend(user)}
                              disabled={isBusy || user.role === 'ADMIN'}
                              className={`p-2 rounded-lg transition-all cursor-pointer flex items-center gap-1 text-xs font-bold ${
                                isSuspended 
                                  ? 'text-emerald-700 bg-emerald-50 hover:bg-emerald-100' 
                                  : 'text-red-600 hover:text-red-700 hover:bg-red-50'
                              } disabled:opacity-40 disabled:cursor-not-allowed`}
                              title={user.role === 'ADMIN' ? 'No se puede suspender administradores' : isSuspended ? 'Reactivar usuario' : 'Suspender usuario'}
                            >
                              {isSuspended ? <UserCheck size={18} /> : <UserX size={18} />}
                              <span className="hidden lg:inline">{isSuspended ? 'Reactivar' : 'Suspender'}</span>
                            </button>
                          )}
                        </div>
                      </td>
                    </motion.tr>
                  );
                })}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

function cn(...inputs: any[]) {
    return inputs.filter(Boolean).join(' ');
}

export default UserManagement;
