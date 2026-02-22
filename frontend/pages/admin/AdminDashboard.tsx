
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const API_BASE_URL = (import.meta.env.VITE_API_URL || '/api').replace(/\/$/, '');

const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In a real app, use an axios instance with interceptors for token
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem('token'); // Simplification for now
        // Or get it from context if passed down
        // For now, assuming axios is configured or we pass headers
        // Since I haven't set up the axios instance globally in this session, I'll assume standard fetch or axios import
        
        // Use relative path relying on proxy or configure full path
        const response = await axios.get(`${API_BASE_URL}/admin/stats`, {
            withCredentials: true // Important for cookies if used
        });
        setStats(response.data);
      } catch (error) {
        console.error("Error loading stats", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) return <div>Cargando estadísticas...</div>;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Resumen Operativo</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard title="Usuarios Totales" value={120} color="blue" />
        <StatCard title="Prestadores" value={stats?.totalProviders || 0} color="green" />
        <StatCard title="Solicitudes Activas" value={stats?.active || 0} color="yellow" />
        <StatCard title="Ingresos (Mes)" value={`$${stats?.totalRevenue || 0}`} color="purple" />
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">Actividad Reciente</h3>
        <p className="text-gray-500">Gráficos y registros detallados próximamente...</p>
      </div>
    </div>
  );
};

const StatCard: React.FC<{title: string, value: string | number, color: string}> = ({ title, value, color }) => (
  <div className={`bg-white p-6 rounded-lg shadow border-l-4 border-${color}-500`}>
    <p className="text-gray-500 text-sm">{title}</p>
    <p className="text-2xl font-bold">{value}</p>
  </div>
);

export default AdminDashboard;
