import { GoogleGenerativeAI, SchemaType } from '@google/generative-ai'
import type { Schema } from '@google/generative-ai'
import type { OcrProvider, DocumentData } from './types'

const ECONOMIC_ACTIVITY_SCHEMA: Schema = {
  type: SchemaType.OBJECT,
  properties: {
    order:      { type: SchemaType.NUMBER },
    activity:   { type: SchemaType.STRING },
    percentage: { type: SchemaType.NUMBER },
    startDate:  { type: SchemaType.STRING },
    endDate:    { type: SchemaType.STRING, nullable: true },
  },
  required: ['order', 'activity', 'percentage', 'startDate', 'endDate'],
}

const DOCUMENT_DATA_SCHEMA: Schema = {
  type: SchemaType.OBJECT,
  properties: {
    name:               { type: SchemaType.STRING, nullable: true },
    curp:               { type: SchemaType.STRING, nullable: true },
    rfc:                { type: SchemaType.STRING, nullable: true },
    dateOfBirth:        { type: SchemaType.STRING, nullable: true },
    confidence:         { type: SchemaType.NUMBER },
    economicActivities: { type: SchemaType.ARRAY, items: ECONOMIC_ACTIVITY_SCHEMA },
  },
  required: ['name', 'curp', 'rfc', 'dateOfBirth', 'confidence', 'economicActivities'],
}

const EXTRACTION_PROMPT =
  'Extract the following fields from this Mexican identity document image: ' +
  'full name (name), CURP (18-character alphanumeric ID), RFC (Mexican tax ID, 12–13 chars), ' +
  'and date of birth (dateOfBirth in ISO 8601 format YYYY-MM-DD). ' +
  'Set confidence to a number from 0 to 1 reflecting your certainty across all extracted fields. ' +
  'Use null for any field not found or not visible in the document. ' +
  'If the document is a Constancia de Situación Fiscal (CSF), also extract EVERY row from the ' +
  '"Actividades Económicas" table: order number (order), activity name (activity), ' +
  'percentage as a number 0–100 (percentage), start date in ISO 8601 YYYY-MM-DD (startDate), ' +
  'and end date in ISO 8601 YYYY-MM-DD (endDate, or null if the cell is empty or blank). ' +
  'Include ALL rows — do not stop after the first. ' +
  'If the document has no such table, return economicActivities as an empty array.'

export class GeminiVisionProvider implements OcrProvider {
  private model: ReturnType<InstanceType<typeof GoogleGenerativeAI>['getGenerativeModel']>

  constructor() {
    const client = new GoogleGenerativeAI(process.env.GEMINI_API_KEY ?? '')
    this.model = client.getGenerativeModel({
      model: 'gemini-3.1-flash-lite',
      generationConfig: {
        responseMimeType: 'application/json',
        responseSchema: DOCUMENT_DATA_SCHEMA,
      },
    })
  }

  async extractData(imageBase64: string, mimeType: string): Promise<DocumentData> {
    const result = await this.model.generateContent([
      { inlineData: { mimeType, data: imageBase64 } },
      { text: EXTRACTION_PROMPT },
    ])

    const text = result.response.text()
    return JSON.parse(text) as DocumentData
  }
}
