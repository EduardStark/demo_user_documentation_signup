'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

interface DocumentUploadFieldProps {
  label: string
  value: File | null
  onChange: (file: File | null) => void
  error?: string
  accept?: string
}

export default function DocumentUploadField({
  label,
  value,
  onChange,
  error,
  accept = 'image/*',
}: DocumentUploadFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [dragActive, setDragActive] = useState(false)
  const [preview, setPreview] = useState<string | null>(null)

  useEffect(() => {
    if (!value) {
      setPreview(null)
      return
    }
    const url = URL.createObjectURL(value)
    setPreview(url)
    return () => URL.revokeObjectURL(url)
  }, [value])

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setDragActive(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setDragActive(false)
  }, [])

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault()
      setDragActive(false)
      const file = e.dataTransfer.files[0]
      if (file) onChange(file)
    },
    [onChange],
  )

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0] ?? null
      onChange(file)
      // reset so the same file can be re-selected
      e.target.value = ''
    },
    [onChange],
  )

  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
        {label}
      </label>

      {preview ? (
        <div className="relative rounded-lg overflow-hidden border border-zinc-200 dark:border-zinc-700">
          {value?.type === 'application/pdf' ? (
            <div className="w-full h-48 flex flex-col items-center justify-center gap-2 bg-zinc-50 dark:bg-zinc-800">
              <span className="text-4xl">📄</span>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">Archivo PDF</p>
            </div>
          ) : (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={preview}
              alt="Vista previa"
              className="w-full h-48 object-cover"
            />
          )}
          <button
            type="button"
            onClick={() => onChange(null)}
            className="absolute top-2 right-2 rounded-full bg-zinc-900/70 text-white w-7 h-7 flex items-center justify-center text-sm hover:bg-zinc-900 transition-colors"
            aria-label="Eliminar imagen"
          >
            ✕
          </button>
          <div className="px-3 py-1.5 bg-zinc-50 dark:bg-zinc-800 border-t border-zinc-200 dark:border-zinc-700">
            <p className="text-xs text-zinc-500 truncate">{value?.name}</p>
          </div>
        </div>
      ) : (
        <div
          role="button"
          tabIndex={0}
          onClick={() => inputRef.current?.click()}
          onKeyDown={(e) => e.key === 'Enter' && inputRef.current?.click()}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`flex flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed h-36 cursor-pointer transition-colors select-none
            ${dragActive
              ? 'border-zinc-500 bg-zinc-100 dark:bg-zinc-800'
              : error
                ? 'border-red-400 bg-red-50 dark:bg-red-950/20'
                : 'border-zinc-300 dark:border-zinc-600 hover:border-zinc-400 dark:hover:border-zinc-500 hover:bg-zinc-50 dark:hover:bg-zinc-800/50'
            }`}
        >
          <span className="text-2xl text-zinc-400">📎</span>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 text-center px-4">
            {dragActive
              ? 'Suelta el archivo aquí'
              : 'Arrastra una imagen o PDF, o haz clic para seleccionar'}
          </p>
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept={accept}
        onChange={handleInputChange}
        className="hidden"
      />

      {error && (
        <p className="text-xs text-red-600 dark:text-red-400">{error}</p>
      )}
    </div>
  )
}
