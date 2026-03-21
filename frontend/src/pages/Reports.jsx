import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Droplets, Trees, Flame, Wind, Trash2, Leaf, Search, Lightbulb } from 'lucide-react';
import { getReportes } from '../services/api';

const statusClass = {
  pendiente:   'bg-gray-500/15 text-gray-400 border border-gray-500/30',
  en_revision: 'bg-yellow-500/15 text-yellow-400 border border-yellow-500/30',
  verificado:  'bg-blue-500/15 text-blue-400 border border-blue-500/30',
  en_proceso:  'bg-orange-500/15 text-orange-400 border border-orange-500/30',
  resuelto:    'bg-green-500/15 text-green-400 border border-green-500/30',
  rechazado:   'bg-red-500/15 text-red-400 border border-red-500/30',
};

const statusLabel = {
  pendiente: 'Pendiente', en_revision: 'En revisión', verificado: 'Verificado',
  en_proceso: 'En proceso', resuelto: 'Resuelto', rechazado: 'Rechazado',
};

const severityClass = {
  bajo:    'bg-green-500/15 text-green-400 border border-green-500/30',
  medio:   'bg-orange-500/15 text-orange-400 border border-orange-500/30',
  alto:    'bg-red-500/15 text-red-400 border border-red-500/30',
  critico: 'bg-red-600/25 text-rose-200 border border-red-500/60',
};

const severityLabel = { bajo: 'Baja', medio: 'Media', alto: 'Alta', critico: 'Crítico' };

const typeIcons = {
  agua:      Droplets,
  aire:      Wind,
  suelo:     Trees,
  ruido:     Flame,
  residuos:  Trash2,
  luminica:  Lightbulb,
  otro:      Leaf,
};

const typeLabel = {
  agua: 'Agua', aire: 'Aire', suelo: 'Suelo', ruido: 'Ruido',
  residuos: 'Residuos', luminica: 'Lumínica', otro: 'Otro',
};

const TYPES    = ['Todos', 'agua', 'aire', 'suelo', 'ruido', 'residuos', 'luminica', 'otro'];
const STATUSES = ['Todos', 'pendiente', 'en_revision', 'verificado', 'en_proceso', 'resuelto', 'rechazado'];

export default function Reports() {
  const navigate = useNavigate();
  const [reports, setReports]          = useState([]);
  const [loading, setLoading]          = useState(true);
  const [error, setError]              = useState('');
  const [search,       setSearch]      = useState('');
  const [typeFilter,   setTypeFilter]  = useState('Todos');
  const [statusFilter, setStatusFilter]= useState('Todos');

  useEffect(() => {
    const fetchReports = async () => {
      setLoading(true);
      setError('');
      try {
        const params = {};
        if (typeFilter   !== 'Todos') params.tipo_contaminacion = typeFilter;
        if (statusFilter !== 'Todos') params.estado = statusFilter;
        const { data } = await getReportes(params);
        setReports(data.data.reportes ?? []);
      } catch {
        setError('No se pudo cargar la lista de reportes.');
      } finally {
        setLoading(false);
      }
    };
    fetchReports();
  }, [typeFilter, statusFilter]);

  const filtered = reports.filter((r) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return r.titulo?.toLowerCase().includes(q) ||
           r.direccion?.toLowerCase().includes(q) ||
           r.municipio?.toLowerCase().includes(q);
  });

  const noData    = !loading && reports.length === 0 && !error;
  const noResults = !loading && reports.length > 0 && filtered.length === 0;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Reportes Ambientales</h1>
          <p className="text-gray-400 mt-1 text-sm">
            {loading ? 'Cargando...' : noData ? 'Sin reportes aún' : `${filtered.length} reportes encontrados`}
          </p>
        </div>
        <Link to="/reports/new" className="btn-primary text-sm self-start sm:self-auto">
          + Nuevo Reporte
        </Link>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <input
          type="text"
          placeholder="Buscar por título, dirección o municipio..."
          className="flex-1 bg-gray-900 border border-gray-700 rounded-lg px-4 py-2.5 text-sm text-gray-200 placeholder-gray-500 focus:outline-none focus:border-green-500 transition-colors"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          disabled={loading || noData}
        />
        <select
          className="bg-gray-900 border border-gray-700 rounded-lg px-4 py-2.5 text-sm text-gray-300 focus:outline-none focus:border-green-500 transition-colors disabled:opacity-40"
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          disabled={loading}
        >
          {TYPES.map((t) => <option key={t} value={t}>{t === 'Todos' ? 'Todos los tipos' : typeLabel[t]}</option>)}
        </select>
        <select
          className="bg-gray-900 border border-gray-700 rounded-lg px-4 py-2.5 text-sm text-gray-300 focus:outline-none focus:border-green-500 transition-colors disabled:opacity-40"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          disabled={loading}
        >
          {STATUSES.map((s) => <option key={s} value={s}>{s === 'Todos' ? 'Todos los estados' : statusLabel[s]}</option>)}
        </select>
      </div>

      {/* Loading */}
      {loading && (
        <div className="card text-center py-16 text-gray-500">
          <div className="w-5 h-5 border-2 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-sm">Cargando reportes...</p>
        </div>
      )}

      {/* Error */}
      {error && !loading && (
        <div className="card text-center py-12 text-red-400">
          <p>{error}</p>
        </div>
      )}

      {/* Empty state */}
      {noData && (
        <div className="card text-center py-20 text-gray-500">
          <div className="w-16 h-16 rounded-2xl bg-green-500/10 flex items-center justify-center mx-auto mb-4">
            <Leaf className="w-8 h-8 text-green-500" />
          </div>
          <p className="font-semibold text-gray-300 text-lg">Aún no hay reportes</p>
          <p className="text-sm mt-2 text-gray-500">Sé el primero en reportar un problema ambiental en tu zona.</p>
          <Link to="/reports/new" className="btn-primary inline-block mt-6">Crear primer reporte</Link>
        </div>
      )}

      {/* Sin resultados tras filtrar */}
      {noResults && (
        <div className="card text-center py-16 text-gray-500">
          <div className="w-14 h-14 rounded-2xl bg-gray-800 flex items-center justify-center mx-auto mb-3">
            <Search className="w-6 h-6 text-gray-500" />
          </div>
          <p className="font-medium">No se encontraron reportes con esos filtros.</p>
          <button
            onClick={() => { setSearch(''); setTypeFilter('Todos'); setStatusFilter('Todos'); }}
            className="text-sm text-green-400 hover:underline mt-2"
          >
            Limpiar filtros
          </button>
        </div>
      )}

      {/* Grid de reportes */}
      {!loading && !error && !noData && !noResults && (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((r) => {
            const Icon = typeIcons[r.tipo_contaminacion] ?? Leaf;
            return (
              <div
                key={r.id_reporte}
                onClick={() => navigate(`/reports/${r.id_reporte}`)}
                className="card hover:border-green-700 transition-colors cursor-pointer group flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-400 flex items-center gap-1.5">
                    <Icon className="w-4 h-4" />
                    {typeLabel[r.tipo_contaminacion] ?? r.tipo_contaminacion}
                  </span>
                  <span className={`badge ${severityClass[r.nivel_severidad]}`}>{severityLabel[r.nivel_severidad] ?? r.nivel_severidad}</span>
                </div>
                <h3 className="font-semibold text-white group-hover:text-green-400 transition-colors leading-snug">
                  {r.titulo}
                </h3>
                {r.descripcion && (
                  <p className="text-sm text-gray-400 leading-relaxed line-clamp-2">{r.descripcion}</p>
                )}
                <div className="flex items-center gap-2 text-xs text-gray-500 mt-auto pt-2 border-t border-gray-800">
                  <span>📍 {[r.municipio, r.departamento].filter(Boolean).join(', ') || r.direccion}</span>
                </div>
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span className={`badge ${statusClass[r.estado]}`}>{statusLabel[r.estado] ?? r.estado}</span>
                  <span>👍 {r.votos_relevancia ?? 0}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
