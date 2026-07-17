'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import CredentialsDisplay from '@/components/CredentialsDisplay'
import type { EconomicActivity } from '@/lib/ocr'

interface RegistroData {
  fullName: string
  age: number
  name: string | null
  curp: string | null
  rfc: string | null
  dateOfBirth: string | null
  confidence: number
  economicActivities?: EconomicActivity[]
  isBlacklisted?: boolean
}

export default function CredencialesPage() {
  const router = useRouter()
  const [data, setData] = useState<RegistroData | null>(null)
  const [missing, setMissing] = useState(false)

  useEffect(() => {
    const raw = sessionStorage.getItem('registroData')
    if (!raw) { setMissing(true); return }
    try {
      setData(JSON.parse(raw) as RegistroData)
    } catch {
      setMissing(true)
    }
  }, [])

  if (missing) {
    return (
      <div className="min-h-screen p-8 max-w-xl mx-auto flex flex-col gap-4 items-start">
        <p className="text-sm text-zinc-500">No se encontraron datos de registro.</p>
        <button
          onClick={() => router.push('/registro')}
          className="rounded-md bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 px-5 py-2.5 text-sm font-medium transition-colors hover:bg-zinc-700 dark:hover:bg-zinc-300"
        >
          Ir al registro
        </button>
      </div>
    )
  }

  if (!data) return null

  return (
    <div className="min-h-screen p-8 max-w-xl mx-auto">
      <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50 mb-1">Credenciales</h1>
      <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-8">
        Revisa los datos extraídos y corrige lo que sea necesario.
      </p>

      <CredentialsDisplay
        initialFields={{
          name: data.name ?? '',
          curp: data.curp ?? '',
          rfc: data.rfc ?? '',
          dateOfBirth: data.dateOfBirth ?? '',
        }}
        confidence={data.confidence}
        fullName={data.fullName}
        age={data.age}
        economicActivities={data.economicActivities}
        isBlacklisted={data.isBlacklisted ?? false}
      />

      <button
        onClick={() => router.push('/registro')}
        className="mt-8 rounded-md border border-zinc-300 dark:border-zinc-600 px-5 py-2.5 text-sm font-medium text-zinc-700 dark:text-zinc-300 transition-colors hover:bg-zinc-100 dark:hover:bg-zinc-800"
      >
        Nuevo registro
      </button>
    </div>
  )
}
