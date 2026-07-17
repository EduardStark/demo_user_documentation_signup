'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import DocumentUploadField from '@/components/DocumentUploadField'
import type { DocumentData } from '@/lib/ocr'

interface RegistroForm {
  fullName: string
  age: number
  inePhoto: File | null
  curpPhoto: File | null
  rfcPhoto: File | null
}

async function uploadDocument(file: File): Promise<DocumentData> {
  const body = new FormData()
  body.append('file', file)
  const res = await fetch('/api/procesar-documento', { method: 'POST', body })
  if (!res.ok) {
    const { error } = await res.json().catch(() => ({ error: 'Error desconocido' }))
    throw new Error(error ?? 'Error al procesar documento')
  }
  return res.json()
}

export default function RegistroPage() {
  const router = useRouter()
  const [submitError, setSubmitError] = useState<string | null>(null)

  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegistroForm>({
    defaultValues: { fullName: '', age: undefined, inePhoto: null, curpPhoto: null, rfcPhoto: null },
  })

  const onSubmit = async (data: RegistroForm) => {
    setSubmitError(null)
    try {
      const [ineResult, curpResult, rfcResult] = await Promise.all([
        uploadDocument(data.inePhoto!),
        uploadDocument(data.curpPhoto!),
        uploadDocument(data.rfcPhoto!),
      ])

      const registroData = {
        fullName: data.fullName,
        age: data.age,
        // Prefer the document best suited to each field
        name: ineResult.name ?? curpResult.name ?? rfcResult.name,
        curp: curpResult.curp ?? ineResult.curp,
        rfc: rfcResult.rfc ?? ineResult.rfc,
        dateOfBirth: ineResult.dateOfBirth ?? curpResult.dateOfBirth,
        confidence:
          Math.round(
            ((ineResult.confidence + curpResult.confidence + rfcResult.confidence) / 3) * 100,
          ) / 100,
        economicActivities: rfcResult.economicActivities ?? [],
      }

      sessionStorage.setItem('registroData', JSON.stringify(registroData))
      router.push('/credenciales')
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'Ocurrió un error. Intenta nuevamente.')
    }
  }

  return (
    <div className="min-h-screen p-8 max-w-xl mx-auto">
      <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50 mb-1">Registro</h1>
      <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-8">
        Completa tus datos y sube los documentos requeridos.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-6">
        {/* Personal data */}
        <section className="flex flex-col gap-4">
          <h2 className="text-sm font-semibold uppercase tracking-widest text-zinc-400">
            Datos personales
          </h2>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="fullName" className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Nombre completo
            </label>
            <input
              id="fullName"
              type="text"
              autoComplete="name"
              placeholder="Nombre(s) y apellidos"
              {...register('fullName', {
                required: 'El nombre es requerido',
                minLength: { value: 3, message: 'Mínimo 3 caracteres' },
              })}
              className="rounded-md border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-900 px-3 py-2 text-sm text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-500 disabled:opacity-50"
            />
            {errors.fullName && (
              <p className="text-xs text-red-600 dark:text-red-400">{errors.fullName.message}</p>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="age" className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Edad
            </label>
            <input
              id="age"
              type="number"
              min={1}
              max={120}
              placeholder="Ej. 30"
              {...register('age', {
                required: 'La edad es requerida',
                min: { value: 1, message: 'Edad mínima: 1' },
                max: { value: 120, message: 'Edad máxima: 120' },
                valueAsNumber: true,
              })}
              className="rounded-md border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-900 px-3 py-2 text-sm text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-500 w-32 disabled:opacity-50"
            />
            {errors.age && (
              <p className="text-xs text-red-600 dark:text-red-400">{errors.age.message}</p>
            )}
          </div>
        </section>

        {/* Documents */}
        <section className="flex flex-col gap-4">
          <h2 className="text-sm font-semibold uppercase tracking-widest text-zinc-400">
            Documentos
          </h2>

          <Controller
            name="inePhoto"
            control={control}
            rules={{ required: 'La foto del INE es requerida' }}
            render={({ field: { value, onChange } }) => (
              <DocumentUploadField
                label="Foto del INE (frente)"
                value={value}
                onChange={onChange}
                error={errors.inePhoto?.message}
                accept="image/*,application/pdf"
              />
            )}
          />

          <Controller
            name="curpPhoto"
            control={control}
            rules={{ required: 'La foto de la CURP es requerida' }}
            render={({ field: { value, onChange } }) => (
              <DocumentUploadField
                label="Foto de la CURP"
                value={value}
                onChange={onChange}
                error={errors.curpPhoto?.message}
                accept="image/*,application/pdf"
              />
            )}
          />

          <Controller
            name="rfcPhoto"
            control={control}
            rules={{ required: 'La foto del RFC / CSF es requerida' }}
            render={({ field: { value, onChange } }) => (
              <DocumentUploadField
                label="Foto del RFC / Constancia de Situación Fiscal"
                value={value}
                onChange={onChange}
                error={errors.rfcPhoto?.message}
                accept="image/*,application/pdf"
              />
            )}
          />
        </section>

        {submitError && (
          <p className="rounded-md bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 px-4 py-3 text-sm text-red-700 dark:text-red-400">
            {submitError}
          </p>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-md bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 px-5 py-2.5 text-sm font-medium transition-colors hover:bg-zinc-700 dark:hover:bg-zinc-300 disabled:opacity-50 disabled:cursor-not-allowed self-start"
        >
          {isSubmitting ? 'Procesando documentos…' : 'Registrarme'}
        </button>
      </form>
    </div>
  )
}
