import { getOcrProvider } from '@/lib/ocr'

export async function POST(request: Request) {
  let formData: FormData
  try {
    formData = await request.formData()
  } catch {
    return Response.json({ error: 'Solicitud inválida' }, { status: 400 })
  }

  const file = formData.get('file')
  if (!(file instanceof Blob)) {
    return Response.json({ error: 'No se recibió ningún archivo' }, { status: 400 })
  }

  const mimeType = file.type || 'image/jpeg'
  const bytes = await file.arrayBuffer()
  const base64 = Buffer.from(bytes).toString('base64')

  try {
    const provider = getOcrProvider()
    const data = await provider.extractData(base64, mimeType)
    return Response.json(data)
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Error interno'
    return Response.json({ error: message }, { status: 500 })
  }
}
