import { useState, lazy, Suspense } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { CheckCircle2, Paperclip } from 'lucide-react';

const LocationPicker = lazy(() => import('../components/LocationPicker'));

const TYPES = [
  'Contaminación de agua',
  'Tala ilegal',
  'Quema de residuos',
  'Contaminación del aire',
  'Residuos sólidos',
  'Ruido excesivo',
  'Contaminación del suelo',
  'Otro',
];

const STEPS = ['Tipo', 'Detalle', 'Ubicación', 'Evidencia'];

export default function NewReport() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    tipo_contaminacion: '',
    nivel_severidad: '',
    titulo: '',
    descripcion: '',
    direccion: '',
    municipio: '',
    departamento: '',
    latitud: '',
    longitud: '',
    file: null,
  });

  const set = (key, value) => setForm((p) => ({ ...p, [key]: value }));

  const canNext = () => {
    if (step === 0) return form.tipo_contaminacion && form.nivel_severidad;
    if (step === 1) return form.titulo.length >= 5 && form.descripcion.length >= 10;
    if (step === 2) return form.direccion.length >= 3;
    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Mock submit
    setTimeout(() => setSubmitted(true), 600);
  };

  if (submitted) {
    return (
      <div className="max-w-lg mx-auto px-4 py-24 text-center">
        <div className="w-20 h-20 rounded-full bg-green-500/15 flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 className="w-10 h-10 text-green-400" />
        </div>
        <h2 className="text-2xl font-bold text-white">¡Reporte enviado!</h2>
        <p className="text-gray-400 mt-3 leading-relaxed">
          Tu reporte ha sido registrado y será revisado por el equipo de moderación.
          Gracias por contribuir al cuidado del medio ambiente.
        </p>
        <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
          <button onClick={() => { setSubmitted(false); setStep(0); setForm({ type: '', severity: '', title: '', description: '', location: '', coords: '', file: null }); }} className="btn-secondary">
            Nuevo reporte
          </button>
          <Link to="/reports" className="btn-primary">Ver reportes</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10">
      {/* Header */}
      <div className="mb-8">
        <Link to="/reports" className="text-sm text-gray-500 hover:text-gray-300 flex items-center gap-1.5 mb-4">
          ← Volver a reportes
        </Link>
        <h1 className="text-2xl font-bold text-white">Nuevo Reporte Ambiental</h1>
        <p className="text-gray-400 mt-1 text-sm">Completa los datos del problema que deseas reportar.</p>
      </div>

      {/* Step indicators */}
      <div className="flex items-center gap-2 mb-8">
        {STEPS.map((label, i) => (
          <div key={label} className="flex items-center gap-2">
            <div className={`flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold transition-colors ${
              i < step ? 'bg-green-500 text-gray-950' : i === step ? 'bg-green-500/20 border border-green-500 text-green-400' : 'bg-gray-800 text-gray-500'
            }`}>
              {i < step ? '✓' : i + 1}
            </div>
            <span className={`text-xs hidden sm:block ${i === step ? 'text-green-400' : 'text-gray-500'}`}>{label}</span>
            {i < STEPS.length - 1 && <div className={`flex-1 h-px w-6 ${i < step ? 'bg-green-500' : 'bg-gray-700'}`} />}
          </div>
        ))}
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit}>
        <div className="card">
          {/* Step 0: Tipo */}
          {step === 0 && (
            <div className="flex flex-col gap-5">
              <h2 className="font-semibold text-white">¿Qué tipo de problema es?</h2>
              <div className="grid grid-cols-2 gap-3">
                {TYPES.map((t) => (
                  <button
                    type="button"
                    key={t}
                    onClick={() => set('tipo_contaminacion', t)}
                    className={`text-sm text-left px-4 py-3 rounded-lg border transition-colors ${
                      form.tipo_contaminacion === t
                        ? 'border-green-500 bg-green-500/10 text-green-300'
                        : 'border-gray-700 bg-gray-800/50 text-gray-300 hover:border-gray-600'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>

              <div>
                <label className="text-sm text-gray-400 mb-2 block">Severidad</label>
                <div className="flex gap-3">
                  {['Baja', 'Media', 'Alta'].map((s) => (
                    <button
                      type="button"
                      key={s}
                      onClick={() => set('nivel_severidad', s)}
                      className={`flex-1 py-2 text-sm rounded-lg border transition-colors ${
                        form.nivel_severidad === s
                          ? s === 'Alta' ? 'border-red-500 bg-red-500/10 text-red-400'
                          : s === 'Media' ? 'border-orange-500 bg-orange-500/10 text-orange-400'
                          : 'border-gray-400 bg-gray-500/10 text-gray-300'
                          : 'border-gray-700 text-gray-500 hover:border-gray-600'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 1: Detalle */}
          {step === 1 && (
            <div className="flex flex-col gap-5">
              <h2 className="font-semibold text-white">Describe el problema</h2>
              <div>
                <label className="text-sm text-gray-400 mb-1.5 block">Título corto *</label>
                <input
                  type="text"
                  placeholder="Ej: Vertimiento de aceite en el río"
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-sm text-gray-200 placeholder-gray-500 focus:outline-none focus:border-green-500 transition-colors"
                  value={form.titulo}
                  onChange={(e) => set('titulo', e.target.value)}
                  maxLength={80}
                />
                <span className="text-xs text-gray-600 mt-1 block">{form.titulo.length}/80</span>
              </div>
              <div>
                <label className="text-sm text-gray-400 mb-1.5 block">Descripción detallada *</label>
                <textarea
                  rows={4}
                  placeholder="Describe qué está pasando, desde cuándo, y cualquier detalle relevante..."
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-sm text-gray-200 placeholder-gray-500 focus:outline-none focus:border-green-500 transition-colors resize-none"
                  value={form.descripcion}
                  onChange={(e) => set('descripcion', e.target.value)}
                />
              </div>
            </div>
          )}

          {/* Step 2: Ubicación */}
          {step === 2 && (
            <div className="flex flex-col gap-5">
              <h2 className="font-semibold text-white">¿Dónde ocurre?</h2>
              <div>
                <label className="text-sm text-gray-400 mb-1.5 block">Dirección o lugar de referencia *</label>
                <input
                  type="text"
                  placeholder="Ej: Río Bogotá, cerca al puente de La Virgen"
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-sm text-gray-200 placeholder-gray-500 focus:outline-none focus:border-green-500 transition-colors"
                  value={form.direccion}
                  onChange={(e) => set('direccion', e.target.value)}
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-400 mb-1.5 block">Municipio *</label>
                  <input
                    type="text"
                    placeholder="Ej: Bogotá"
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-sm text-gray-200 placeholder-gray-500 focus:outline-none focus:border-green-500 transition-colors"
                    value={form.municipio}
                    onChange={(e) => set('municipio', e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-400 mb-1.5 block">Departamento *</label>
                  <input
                    type="text"
                    placeholder="Ej: Cundinamarca"
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-sm text-gray-200 placeholder-gray-500 focus:outline-none focus:border-green-500 transition-colors"
                    value={form.departamento}
                    onChange={(e) => set('departamento', e.target.value)}
                  />
                </div>
              </div>
              <div>
                <label className="text-sm text-gray-400 mb-1.5 block">Coordenadas GPS (opcional — usa el mapa o ingresa manualmente)</label>
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="number"
                    step="any"
                    placeholder="Latitud. Ej: 4.7110"
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-sm text-gray-200 placeholder-gray-500 focus:outline-none focus:border-green-500 transition-colors"
                    value={form.latitud}
                    onChange={(e) => set('latitud', e.target.value)}
                  />
                  <input
                    type="number"
                    step="any"
                    placeholder="Longitud. Ej: -74.0721"
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-sm text-gray-200 placeholder-gray-500 focus:outline-none focus:border-green-500 transition-colors"
                    value={form.longitud}
                    onChange={(e) => set('longitud', e.target.value)}
                  />
                </div>
              </div>
              <Suspense fallback={
                <div className="h-44 rounded-lg bg-gray-800/50 border border-gray-700 flex items-center justify-center text-gray-500 text-sm">Cargando mapa...</div>
              }>
                <LocationPicker
                  latitud={form.latitud}
                  longitud={form.longitud}
                  onChange={(lat, lng) => { set('latitud', lat); set('longitud', lng); }}
                />
              </Suspense>
            </div>
          )}

          {/* Step 3: Evidencia */}
          {step === 3 && (
            <div className="flex flex-col gap-5">
              <h2 className="font-semibold text-white">Adjuntar evidencia</h2>
              <p className="text-sm text-gray-400">Sube fotos, videos o documentos que respalden el reporte (opcional).</p>
              <label className="border-2 border-dashed border-gray-700 hover:border-green-600 rounded-xl p-8 text-center cursor-pointer transition-colors group block">
                <input type="file" className="hidden" accept="image/*,video/*,.pdf" onChange={(e) => set('file', e.target.files[0])} />
                <div className="flex flex-col items-center">
                  <Paperclip className="w-8 h-8 text-gray-500 group-hover:text-green-400 transition-colors mb-2" />
                  {form.file ? (
                    <p className="text-sm text-green-400 font-medium">{form.file.name}</p>
                  ) : (
                    <>
                      <p className="text-sm text-gray-400 group-hover:text-gray-300">Haz clic para seleccionar archivo</p>
                      <p className="text-xs text-gray-600 mt-1">JPG, PNG, MP4, PDF — máx. 50MB</p>
                    </>
                  )}
                </div>
              </label>

              {/* Summary */}
              <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700 text-sm space-y-2">
                <p className="font-medium text-gray-300 mb-3">Resumen del reporte</p>
                <div className="flex justify-between text-gray-400"><span>Tipo</span><span className="text-white">{form.tipo_contaminacion}</span></div>
                <div className="flex justify-between text-gray-400"><span>Severidad</span><span className="text-white">{form.nivel_severidad}</span></div>
                <div className="flex justify-between text-gray-400"><span>Título</span><span className="text-white truncate max-w-[60%] text-right">{form.titulo}</span></div>
                <div className="flex justify-between text-gray-400"><span>Municipio</span><span className="text-white">{form.municipio}</span></div>
                <div className="flex justify-between text-gray-400"><span>Departamento</span><span className="text-white">{form.departamento}</span></div>
                <div className="flex justify-between text-gray-400"><span>Dirección</span><span className="text-white truncate max-w-[60%] text-right">{form.direccion}</span></div>
              </div>
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="flex justify-between mt-6">
          <button
            type="button"
            onClick={() => setStep((s) => s - 1)}
            disabled={step === 0}
            className="btn-secondary disabled:opacity-30 disabled:cursor-not-allowed"
          >
            Anterior
          </button>

          {step < STEPS.length - 1 ? (
            <button
              type="button"
              onClick={() => setStep((s) => s + 1)}
              disabled={!canNext()}
              className="btn-primary disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Siguiente
            </button>
          ) : (
            <button type="submit" className="btn-primary">
              Enviar Reporte
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
