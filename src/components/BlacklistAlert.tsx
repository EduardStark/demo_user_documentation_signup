'use client'

interface BlacklistAlertProps {
  onClose: () => void
}

export default function BlacklistAlert({ onClose }: BlacklistAlertProps) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="w-full max-w-sm rounded-2xl overflow-hidden border border-red-900/60 shadow-2xl shadow-red-950/40">
        {/* Header */}
        <div className="bg-red-950 px-6 pt-7 pb-6 flex flex-col items-center text-center gap-4">
          <div className="w-16 h-16 rounded-full bg-red-500/15 border-2 border-red-500/60 flex items-center justify-center">
            <span className="text-4xl leading-none">⛔</span>
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-red-400 mb-1">
              Lista Negra SAT
            </p>
            <h2 className="text-white font-bold text-lg">
              Alerta de restricción
            </h2>
          </div>
        </div>

        {/* Body */}
        <div className="bg-zinc-950 px-6 py-6 border-t border-red-900/30">
          <p className="text-sm text-zinc-300 text-center leading-relaxed">
            Las actividades comerciales con esta persona no son permitidas,
            el usuario se encuentra en la{' '}
            <span className="text-red-400 font-semibold">lista negra del SAT</span>.
          </p>
        </div>

        {/* Footer */}
        <div className="bg-zinc-950 border-t border-zinc-800 px-6 pb-6 pt-4 flex gap-3">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 rounded-xl border border-zinc-700 px-4 py-2.5 text-sm font-medium text-zinc-300 transition-colors hover:bg-zinc-800 hover:text-white"
          >
            Ignorar
          </button>
          <button
            type="button"
            onClick={onClose}
            className="flex-1 rounded-xl bg-red-700 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-red-600 active:bg-red-800"
          >
            Entiendo
          </button>
        </div>
      </div>
    </div>
  )
}
