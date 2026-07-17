'use client'

import { useState } from 'react'
import { isValidCurp } from '@/lib/validation/curp'
import { isValidRfc } from '@/lib/validation/rfc'
import { checkEconomicActivitiesSum } from '@/lib/validation/economicActivities'
import type { EconomicActivity } from '@/lib/ocr'
import BlacklistAlert from '@/components/BlacklistAlert'

interface CredentialFields {
  name: string
  curp: string
  rfc: string
  dateOfBirth: string
}

interface CredentialsDisplayProps {
  initialFields: CredentialFields
  confidence: number
  fullName: string
  age: number
  economicActivities?: EconomicActivity[]
  isBlacklisted?: boolean
}

function ConfidenceMeter({ value }: { value: number }) {
  const pct = Math.round(value * 100)
  const high = value >= 0.8
  const mid = value >= 0.5

  const barColor = high ? 'bg-green-500' : mid ? 'bg-yellow-400' : 'bg-red-500'
  const textColor = high
    ? 'text-green-400'
    : mid
      ? 'text-yellow-400'
      : 'text-red-400'
  const label = high ? 'Confianza alta' : mid ? 'Confianza media' : 'Confianza baja'

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between">
        <span className={`text-[11px] font-semibold uppercase tracking-wider ${textColor}`}>
          {label}
        </span>
        <span className={`text-[11px] font-bold tabular-nums ${textColor}`}>{pct}%</span>
      </div>
      <div className="h-1 rounded-full bg-white/10 overflow-hidden">
        <div
          className={`h-full rounded-full ${barColor} transition-all duration-500`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  )
}

function CardField({
  label,
  value,
  onChange,
  invalid = false,
  hint,
}: {
  label: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  invalid?: boolean
  hint?: string
}) {
  return (
    <div className="flex flex-col gap-0.5 group">
      <span
        className={`text-[9px] font-bold uppercase tracking-[0.15em] transition-colors ${
          invalid ? 'text-red-500 dark:text-red-400' : 'text-zinc-500'
        }`}
      >
        {label}
      </span>
      <input
        type="text"
        value={value}
        onChange={onChange}
        placeholder="—"
        className={`border-b bg-transparent py-1 text-sm font-mono placeholder:text-zinc-400 focus:outline-none transition-colors ${
          invalid
            ? 'border-red-400 dark:border-red-500 text-red-700 dark:text-red-300 focus:border-red-500'
            : 'border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 focus:border-zinc-500 dark:focus:border-zinc-400 group-focus-within:border-zinc-400'
        }`}
      />
      {invalid && hint && (
        <span className="text-[10px] text-red-500 dark:text-red-400 mt-0.5">{hint}</span>
      )}
    </div>
  )
}

export default function CredentialsDisplay({
  initialFields,
  confidence,
  fullName,
  age,
  economicActivities,
  isBlacklisted = false,
}: CredentialsDisplayProps) {
  const [fields, setFields] = useState<CredentialFields>(initialFields)
  const [showAlert, setShowAlert] = useState(isBlacklisted)

  const set =
    (key: keyof CredentialFields) => (e: React.ChangeEvent<HTMLInputElement>) =>
      setFields((prev) => ({ ...prev, [key]: e.target.value }))

  const curpInvalid = fields.curp.length > 0 && !isValidCurp(fields.curp)
  const rfcInvalid = fields.rfc.length > 0 && !isValidRfc(fields.rfc)
  const activities = economicActivities ?? []
  const sumValid = checkEconomicActivitiesSum(activities)
  const total = activities.reduce((s, a) => s + a.percentage, 0)

  return (
    <>
      {showAlert && <BlacklistAlert onClose={() => setShowAlert(false)} />}
    <div className="w-full max-w-sm flex flex-col gap-6">
    <div className={`rounded-2xl overflow-hidden shadow-2xl border ${isBlacklisted ? 'border-red-500/50' : 'border-zinc-200 dark:border-zinc-700'}`}>
      {/* Card header */}
      <div className="relative bg-zinc-900 px-6 pt-6 pb-5 overflow-hidden">
        {/* Decorative chip */}
        <div className="absolute top-5 right-6 w-10 h-7 rounded bg-yellow-400/20 border border-yellow-400/30 flex flex-col justify-center gap-0.5 px-1">
          <div className="h-px bg-yellow-400/60 rounded" />
          <div className="h-px bg-yellow-400/60 rounded w-3/4" />
          <div className="h-px bg-yellow-400/60 rounded" />
        </div>

        <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-zinc-500 mb-3">
          Identificación digital
        </p>

        {isBlacklisted && (
          <div className="inline-flex items-center gap-1.5 bg-red-950 border border-red-500/50 rounded-full px-3 py-1 mb-3">
            <span className="text-xs leading-none">⛔</span>
            <span className="text-[10px] font-bold uppercase tracking-wider text-red-400">Lista Negra SAT</span>
          </div>
        )}

        <p className="text-white font-semibold text-base leading-snug truncate pr-14">
          {fullName}
        </p>
        <p className="text-zinc-400 text-xs mt-0.5">{age} años</p>

        <div className="mt-5">
          <ConfidenceMeter value={confidence} />
        </div>
      </div>

      {/* Card body — editable fields */}
      <div className="bg-white dark:bg-zinc-900 px-6 py-5 flex flex-col gap-5">
        <CardField label="Nombre completo" value={fields.name} onChange={set('name')} />
        <CardField
          label="CURP"
          value={fields.curp}
          onChange={set('curp')}
          invalid={curpInvalid}
          hint="Formato inválido — 18 caracteres (ej. VECJ880326HMSLNS09)"
        />
        <CardField
          label="RFC"
          value={fields.rfc}
          onChange={set('rfc')}
          invalid={rfcInvalid}
          hint="Formato inválido — 12 o 13 caracteres (ej. VECJ880326XXX)"
        />
        <CardField label="Fecha de nacimiento" value={fields.dateOfBirth} onChange={set('dateOfBirth')} />
      </div>

      {/* Card footer */}
      <div className="bg-zinc-50 dark:bg-zinc-800/50 border-t border-zinc-100 dark:border-zinc-700/50 px-6 py-3">
        <p className="text-[10px] text-zinc-400 text-center tracking-wide">
          Toca cualquier campo para corregirlo
        </p>
      </div>
    </div>

    {activities.length > 0 && (
      <div className="rounded-2xl overflow-hidden shadow-lg border border-zinc-200 dark:border-zinc-700">
        <div className="bg-zinc-900 px-6 py-4 flex items-center justify-between">
          <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-zinc-400">
            Actividades Económicas
          </p>
          {!sumValid && (
            <span className="text-[10px] font-semibold text-amber-400 bg-amber-400/10 border border-amber-400/30 rounded px-2 py-0.5">
              ⚠ Suma ≠ 100%
            </span>
          )}
        </div>
        <div className="bg-white dark:bg-zinc-900 overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-zinc-100 dark:border-zinc-800">
                <th className="px-4 py-2 text-left text-[10px] uppercase tracking-wider text-zinc-400 font-semibold">Actividad</th>
                <th className="px-4 py-2 text-right text-[10px] uppercase tracking-wider text-zinc-400 font-semibold">%</th>
                <th className="px-4 py-2 text-left text-[10px] uppercase tracking-wider text-zinc-400 font-semibold">Inicio</th>
              </tr>
            </thead>
            <tbody>
              {activities.map((act) => (
                <tr key={act.order} className="border-b border-zinc-50 dark:border-zinc-800/50 last:border-0">
                  <td className="px-4 py-2.5 text-zinc-900 dark:text-zinc-100">{act.activity}</td>
                  <td className="px-4 py-2.5 text-zinc-900 dark:text-zinc-100 tabular-nums text-right">{act.percentage}%</td>
                  <td className="px-4 py-2.5 text-zinc-500 font-mono">{act.startDate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="bg-zinc-50 dark:bg-zinc-800/50 border-t border-zinc-100 dark:border-zinc-700/50 px-4 py-2">
          <p className={`text-[10px] text-right tabular-nums ${sumValid ? 'text-zinc-400' : 'text-amber-500'}`}>
            Total: {total}%
          </p>
        </div>
      </div>
    )}
    </div>
    </>
  )
}
