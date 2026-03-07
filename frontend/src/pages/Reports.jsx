import { useState } from 'react';
import { Link } from 'react-router-dom';

const statusClass = {
  'En revisión': 'bg-yellow-500/15 text-yellow-400 border border-yellow-500/30',
  Verificado:    'bg-blue-500/15 text-blue-400 border border-blue-500/30',
  Resuelto:      'bg-green-500/15 text-green-400 border border-green-500/30',
};

const severityClass = {
  Alta:  'bg-red-500/15 text-red-400 border border-red-500/30',
  Media: 'bg-orange-500/15 text-orange-400 border border-orange-500/30',
  Baja:  'bg-gray-500/15 text-gray-400 border border-gray-500/30',
};

const typeIcons = {
  'Contaminación de agua': '💧',
  'Tala ilegal':           '🌳',
  'Quema de residuos':     '🔥',
  'Contaminación del aire': '💨',
  'Residuos sólidos':      '🗑️',
};

const TYPES    = ['Todos', ...Object.keys(typeIcons)];
const STATUSES = ['Todos', 'En revisión', 'Verificado', 'Resuelto'];

export default function Reports() {
  const [reports]      = useState([]);
  const [search,       setSearch]       = useState('');
  const [typeFilter,   setTypeFilter]   = useState('Todos');
  const [statusFilter, setStatusFilter] = useState('Todos');

  const filtered = reports.filter((r) => {
    const matchSearch  = r.title.toLowerCase().includes(search.toLowerCase()) ||
                         r.location.toLowerCase().includes(search.toLowerCase());
    const matchType    = typeFilter   === 'Todos' || r.type   === typeFilter;
    const matchStatus  = statusFilter === 'Todos' || r.status === statusFilter;
    return matchSearch && matchType && matchStatus;
  });

  const noData    = reports.length === 0;
  const noResults = !noData && filtered.length === 0;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Reportes Ambientales</h1>
          <p className="text-gray-400 mt-1 text-sm">
            {noData ? 'Sin reportes aún' : `${filtered.length} reportes encontrados`}
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
          placeholder="Buscar por título o ubicación..."
          className="flex-1 bg-gray-900 border border-gray-700 rounded-lg px-4 py-2.5 text-sm text-gray-200 placeholder-gray-500 focus:outline-none focus:border-green-500 transition-colors"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          disabled={noData}
        />
        <select
          className="bg-gray-900 border border-gray-700 rounded-lg px-4 py-2.5 text-sm text-gray-300 focus:outline-none focus:border-green-500 transition-colors disabled:opacity-40"
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          disabled={noData}
        >
          {TYPES.map((t) => <option key={t}>{t}</option>)}
        </select>
        <select
          className="bg-gray-900 border border-gray-700 rounded-lg px-4 py-2.5 text-sm text-gray-300 focus:outline-none focus:border-green-500 transition-colors disabled:opacity-40"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          disabled={noData}
        >
          {STATUSES.map((s) => <option key={s}>{s}</option>)}
        </select>
      </div>

      {/* Empty state — sin datos aún */}
      {noData && (
        <div className="card text-center py-20 text-gray-500">
          <div className="text-5xl mb-4">🌿</div>
          <p className="font-semibold text-gray-300 text-lg">Aún no hay reportes</p>
          <p className="text-sm mt-2 text-gray-500">Sé el primero en reportar un problema ambiental en tu zona.</p>
          <Link to="/reports/new" className="btn-primary inline-block mt-6">
            Crear primer reporte
          </Link>
        </div>
      )}

      {/* Sin resultados tras filtrar */}
      {noResults && (
        <div className="card text-center py-16 text-gray-500">
          <div className="text-4xl mb-3">🔍</div>
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
      {!noData && !noResults && (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((r) => (
            <div key={r.id} className="card hover:border-gray-700 transition-colors cursor-pointer group flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-400 flex items-center gap-1.5">
                  <span>{typeIcons[r.type] || '⚠️'}</span>
                  {r.type}
                </span>
                <span className={`badge ${severityClass[r.severity]}`}>{r.severity}</span>
              </div>
              <h3 className="font-semibold text-white group-hover:text-green-400 transition-colors leading-snug">
                {r.title}
              </h3>
              <p className="text-sm text-gray-400 leading-relaxed line-clamp-2">{r.description}</p>
              <div className="flex items-center gap-2 text-xs text-gray-500 mt-auto pt-2 border-t border-gray-800">
                <span>📍 {r.location}</span>
              </div>
              <div className="flex items-center justify-between text-xs text-gray-500">
                <span className={`badge ${statusClass[r.status]}`}>{r.status}</span>
                <div className="flex items-center gap-3">
                  <span>👤 {r.author}</span>
                  <span>👍 {r.votes}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
