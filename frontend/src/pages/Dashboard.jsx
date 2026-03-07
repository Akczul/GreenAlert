import { useEffect, useState, lazy, Suspense } from 'react';
import { checkHealth } from '../services/api';

const ReportsMap = lazy(() => import('../components/ReportsMap'));

const statCards = [
  { label: 'Reportes este mes', icon: '📋' },
  { label: 'En revisión',       icon: '🔍' },
  { label: 'Resueltos',         icon: '✅' },
  { label: 'Usuarios activos',  icon: '👥' },
];

const severityClass = {
  Alta:  'bg-red-500/15 text-red-400 border border-red-500/30',
  Media: 'bg-yellow-500/15 text-yellow-400 border border-yellow-500/30',
  Baja:  'bg-green-500/15 text-green-400 border border-green-500/30',
};

export default function Dashboard() {
  const [health, setHealth] = useState({ status: 'cargando', database: '...', timestamp: null });
  const [loading, setLoading] = useState(true);
  const [activity] = useState([]);

  const fetchHealth = async () => {
    setLoading(true);
    try {
      const { data } = await checkHealth();
      setHealth(data);
    } catch {
      setHealth({ status: 'error', message: 'No se pudo conectar al servidor', database: 'desconectada' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHealth();
  }, []);

  const isOk = health.status === 'ok';

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Dashboard</h1>
        <p className="text-gray-400 mt-1 text-sm">Resumen del estado del sistema y actividad reciente.</p>
      </div>

      {/* Health check */}
      <section className="mb-8">
        <div className={`card flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
          loading ? 'border-gray-700' : isOk ? 'border-green-700 bg-green-950/20' : 'border-red-700 bg-red-950/20'
        }`}>
          <div className="flex items-center gap-3">
            <div className={`w-3 h-3 rounded-full ${loading ? 'bg-gray-500 animate-pulse' : isOk ? 'bg-green-400 animate-pulse' : 'bg-red-400'}`} />
            <div>
              <p className="text-sm font-medium text-gray-300">Estado del servidor</p>
              {loading ? (
                <p className="text-xs text-gray-500 mt-0.5">Verificando conexión...</p>
              ) : (
                <p className={`text-xs mt-0.5 ${isOk ? 'text-green-400' : 'text-red-400'}`}>
                  {isOk
                    ? `Servidor OK • Base de datos ${health.database}`
                    : health.message || 'Error de conexión'}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3">
            {health.timestamp && (
              <span className="text-xs text-gray-500">
                {new Date(health.timestamp).toLocaleTimeString('es-CO')}
              </span>
            )}
            <button
              onClick={fetchHealth}
              disabled={loading}
              className="text-xs text-green-400 hover:text-green-300 border border-green-500/30 px-3 py-1.5 rounded-lg transition-colors disabled:opacity-50"
            >
              {loading ? 'Verificando...' : 'Verificar ahora'}
            </button>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {statCards.map((s) => (
          <div key={s.label} className="card">
            <span className="text-2xl">{s.icon}</span>
            <div className="mt-4">
              <div className="text-3xl font-extrabold text-white">—</div>
              <div className="text-sm text-gray-400 mt-1">{s.label}</div>
            </div>
          </div>
        ))}
      </section>

      {/* Recent activity */}
      <section>
        <h2 className="font-semibold text-white mb-4">Actividad Reciente</h2>
        <div className="card p-0 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-800">
                <th className="text-left px-5 py-3 text-gray-400 font-medium">Tipo</th>
                <th className="text-left px-5 py-3 text-gray-400 font-medium hidden sm:table-cell">Ubicación</th>
                <th className="text-left px-5 py-3 text-gray-400 font-medium hidden md:table-cell">Tiempo</th>
                <th className="text-left px-5 py-3 text-gray-400 font-medium">Severidad</th>
              </tr>
            </thead>
            <tbody>
              {activity.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-5 py-12 text-center text-gray-500">
                    <p className="text-sm">No hay actividad registrada aún.</p>
                    <p className="text-xs mt-1 text-gray-600">Los reportes aparecerán aquí en tiempo real.</p>
                  </td>
                </tr>
              ) : (
                activity.map((item, i) => (
                  <tr key={item.id} className={`border-b border-gray-800/50 hover:bg-gray-800/40 transition-colors ${i === activity.length - 1 ? 'border-0' : ''}`}>
                    <td className="px-5 py-3.5 text-gray-200 font-medium">{item.type}</td>
                    <td className="px-5 py-3.5 text-gray-400 hidden sm:table-cell">{item.location}</td>
                    <td className="px-5 py-3.5 text-gray-500 hidden md:table-cell">{item.time}</td>
                    <td className="px-5 py-3.5">
                      <span className={`badge ${severityClass[item.severity]}`}>{item.severity}</span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* Mapa de reportes */}
      <section className="mt-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-white">Mapa de Reportes</h2>
          <div className="flex items-center gap-4 text-xs text-gray-400">
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-red-400 inline-block" />Alta</span>
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-orange-400 inline-block" />Media</span>
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-green-400 inline-block" />Baja</span>
          </div>
        </div>
        <div className="rounded-xl overflow-hidden border border-gray-800" style={{ height: '420px' }}>
          <Suspense fallback={
            <div className="h-full flex items-center justify-center bg-gray-900 text-gray-500 text-sm">Cargando mapa...</div>
          }>
            <ReportsMap />
          </Suspense>
        </div>
      </section>
    </div>
  );
}
