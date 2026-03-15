import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Droplets, Trees, Flame, Wind, Trash2, Leaf, Lightbulb,
  ArrowLeft, MapPin, Calendar, ThumbsUp, Eye,
} from 'lucide-react';
import { getReporteById } from '../services/api';

const typeIcons = {
  agua: Droplets, aire: Wind, suelo: Trees,
  ruido: Flame, residuos: Trash2, luminica: Lightbulb, otro: Leaf,
};
const typeLabel = {
  agua: 'Contaminación de agua', aire: 'Contaminación del aire',
  suelo: 'Contaminación del suelo', ruido: 'Contaminación sonora',
  residuos: 'Residuos sólidos', luminica: 'Contaminación lumínica', otro: 'Otra',
};
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

const formatDate = (iso) =>
  new Date(iso).toLocaleDateString('es-CO', {
    year: 'numeric', month: 'long', day: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });

export default function ReportDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    getReporteById(id)
      .then(({ data }) => setReport(data.data.reporte))
      .catch(() => setError('No se pudo cargar el reporte.'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-20 text-center text-gray-500">
        <div className="w-6 h-6 border-2 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-sm">Cargando reporte...</p>
      </div>
    );
  }

  if (error || !report) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-20 text-center">
        <p className="text-red-400 mb-4">{error || 'Reporte no encontrado.'}</p>
        <button onClick={() => navigate('/reports')} className="btn-secondary text-sm">
          Volver a Reportes
        </button>
      </div>
    );
  }

  const Icon = typeIcons[report.tipo_contaminacion] ?? Leaf;
  const location = [report.municipio, report.departamento].filter(Boolean).join(', ') || report.direccion;

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
      {/* Back */}
      <button
        onClick={() => navigate('/reports')}
        className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Volver a Reportes
      </button>

      <div className="card flex flex-col gap-6">
        {/* Header */}
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="flex items-center gap-2 text-gray-400 text-sm">
            <Icon className="w-5 h-5 text-green-400" />
            <span>{typeLabel[report.tipo_contaminacion] ?? report.tipo_contaminacion}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className={`badge ${severityClass[report.nivel_severidad]}`}>
              {severityLabel[report.nivel_severidad] ?? report.nivel_severidad}
            </span>
            <span className={`badge ${statusClass[report.estado]}`}>
              {statusLabel[report.estado] ?? report.estado}
            </span>
          </div>
        </div>

        {/* Title */}
        <div>
          <h1 className="text-2xl font-bold text-white leading-snug">{report.titulo}</h1>
        </div>

        {/* Description */}
        {report.descripcion && (
          <p className="text-gray-300 leading-relaxed">{report.descripcion}</p>
        )}

        {/* Meta info grid */}
        <div className="grid sm:grid-cols-2 gap-4 pt-4 border-t border-gray-800 text-sm">
          {location && (
            <div className="flex items-start gap-2 text-gray-400">
              <MapPin className="w-4 h-4 mt-0.5 text-green-400 shrink-0" />
              <div>
                <p className="text-gray-500 text-xs mb-0.5">Ubicación</p>
                <p className="text-gray-200">{location}</p>
                {report.direccion && location !== report.direccion && (
                  <p className="text-gray-500 text-xs mt-0.5">{report.direccion}</p>
                )}
              </div>
            </div>
          )}

          {report.latitud && report.longitud && (
            <div className="flex items-start gap-2 text-gray-400">
              <MapPin className="w-4 h-4 mt-0.5 text-gray-600 shrink-0" />
              <div>
                <p className="text-gray-500 text-xs mb-0.5">Coordenadas</p>
                <p className="text-gray-400 font-mono text-xs">
                  {parseFloat(report.latitud).toFixed(6)}, {parseFloat(report.longitud).toFixed(6)}
                </p>
              </div>
            </div>
          )}

          <div className="flex items-start gap-2 text-gray-400">
            <Calendar className="w-4 h-4 mt-0.5 text-green-400 shrink-0" />
            <div>
              <p className="text-gray-500 text-xs mb-0.5">Registrado</p>
              <p className="text-gray-200">{formatDate(report.created_at)}</p>
            </div>
          </div>

          <div className="flex items-center gap-4 text-gray-400">
            <div className="flex items-center gap-1.5">
              <ThumbsUp className="w-4 h-4 text-green-400" />
              <span className="text-gray-200 font-semibold">{report.votos_relevancia ?? 0}</span>
              <span className="text-xs text-gray-500">votos</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Eye className="w-4 h-4 text-gray-500" />
              <span className="text-gray-400">{report.vistas ?? 0}</span>
              <span className="text-xs text-gray-500">vistas</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
